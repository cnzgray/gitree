import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { GitRepo, GitFile, GitObject, GitPatch, GitDiff, GitSubmodule, GitNode, GitObjectType } from '../types'
import { createError } from './error'
import { parseGitmodules } from '../utils/parse'
import { debug } from '@/utils/log'

type GithubApiOptions = {
  username: string
  reponame: string
  path?: string
  token?: string
}

/**
 * Github Api Result - PR
 */
type GithubApiPRResult = [
  {
    additions: number
    blob_url: string
    changes: number
    contents_url: string
    deletions: number
    filename: string
    patch: string
    raw_url: string
    sha: string
    status: string
  }
]

/**
 * Github Api Result - Trees
 */
type GithubApiTreesResult = {
  sha: string
  truncated: boolean
  url: string
  tree: GitFile[]
}

type GithubApiBlobResult = {
  content: string
  encoding: string
  node_id: string
  sha: string
  size: number
  url: string
}

/**
 * request github api
 */
export function requestApi<TResult = any>({ username, reponame, path, token }: GithubApiOptions): Promise<TResult> {
  const cfg: AxiosRequestConfig = {
    baseURL: `${location.protocol}//${location.host === 'github.com' ? 'api.github.com' : location.host + '/api/v3'}`,
    url: `/repos/${username}/${reponame}${path || ''}`,
    method: 'GET'
  }

  if (token) {
    cfg.headers = { Authorization: 'token ' + token }
  } else {
    debug('当前未使用accessKey进行API请求!')
  }

  return axios.request<TResult>(cfg).then(
    resp => {
      // @ts-ignore
      if (path && path.indexOf('/git/trees') === 0 && resp.data.truncated) throw createError({ status: 206 })
      return resp.data
    },
    error => {
      throw createError(error.response)
    }
  )
}

function requestTree(repo: GitRepo, path?: string, token?: string): Promise<GitObject[]> {
  if (repo.pullNumber) {
    return requestPatch(repo, token)
  } else {
    return requestApi<GithubApiTreesResult>({ path: `/git/trees/${path}`, ...repo, token }).then(data => data.tree) // TODO: 当前类型并未明确
  }
}

export function requestPatch(repo: GitRepo, token?: string) {
  const { pullNumber } = repo

  return requestApi<GithubApiPRResult>({ path: `/pulls/${pullNumber}/files?per_page=300`, ...repo, token }).then(
    res => {
      const diffMap: { [filename: string]: GitPatch } = {}

      res.forEach((file, index) => {
        // record file patch info
        diffMap[file.filename] = {
          type: 'blob',
          diffId: index,
          action: file.status,
          additions: file.additions,
          blob_url: file.blob_url,
          deletions: file.deletions,
          filename: file.filename,
          // path: file.path,
          sha: file.sha
        }

        // record ancestor folders
        const folderPath = file.filename
          .split('/')
          .slice(0, -1)
          .join('/')
        const split = folderPath.split('/')

        // aggregate metadata for ancestor folders
        split.reduce((path: string, curr: any) => {
          if (path.length) path = `${path}/${curr}`
          else path = `${curr}`

          if (diffMap[path] == null) {
            diffMap[path] = {
              type: 'tree',
              filename: path,
              filesChanged: 1,
              additions: file.additions,
              deletions: file.deletions
            }
          } else {
            diffMap[path].additions += file.additions
            diffMap[path].deletions += file.deletions
            // @ts-ignore
            diffMap[path].filesChanged++
          }
          return path
        }, '')
      })

      // transform to emulate response from get `tree`
      const tree = Object.keys(diffMap).map<GitDiff>(filename => {
        const patch = diffMap[filename]
        return {
          patch,
          path: filename,
          sha: patch.sha,
          type: patch.type,
          url: patch.blob_url
        }
      })

      // sort by path, needs to be alphabetical order (so parent folders come before children)
      // note: this is still part of the above transform to mimic the behavior of get tree
      tree.sort((a, b) => a.path.localeCompare(b.path))

      return tree
    }
  )
}

function requestSubmodules(tree: GitObject[], repo: GitRepo, token?: string): Promise<GitSubmodule | void> {
  const item = tree.filter(item => /^\.gitmodules$/i.test(item.path))[0]
  if (!item) return Promise.resolve()
  return requestApi<GithubApiBlobResult>({ path: `/git/blobs/${item.sha}`, ...repo, token }).then(res => {
    const data = atob(res.content.replace(/\n/g, ''))
    return parseGitmodules(data)
  })
}

export function requestCodeTree(repo: GitRepo, node?: GitNode, token?: string) {
  const encodedBranch = encodeURIComponent(decodeURIComponent(repo.branch))
  const path = (node && node.sha) || encodedBranch + '?recursive=1'

  return requestTree(repo, path, token)
    .then(tree => Promise.all([tree, requestSubmodules(tree, repo, token)]))
    .then(([tree, submodules = {}]) => {
      const folders: { [name: string]: GitNode[] } = { '': [] }

      tree.forEach(item => {
        // if lazy load and has parent, prefix with parent path
        if (node && node.path) {
          item.path = node.path + '/' + item.path
        }

        const path = item.path
        const type = item.type
        const index = path.lastIndexOf('/')
        const name = path.substring(index + 1)

        const result = { id: path, text: name, ...item } as GitNode

        // TODO: SUPPORT_FILE_ICONS

        // uses `type` as class name for tree node
        // item.icon = type

        // // @ifdef SUPPORT_FILE_ICONS
        // if (type === 'blob') {
        //   if (this.store.get(STORE.ICONS)) {
        //     const className = FileIcons.getClassWithColor(name)
        //     item.icon += ' ' + (className || 'file-generic')
        //   } else {
        //     item.icon += ' file-generic'
        //   }
        // }
        // // @endif
        // @ifndef SUPPORT_FILE_ICONS
        // item.icon += ' file-generic'
        // @endif

        if (node) {
          folders[''].push(result) // root folders
        } else {
          folders[path.substring(0, index)].push(result)
        }

        if (type === 'tree' || type === 'blob') {
          if (type === 'tree') {
            folders[item.path] = result.children = []
          }

          // if item is part of a PR, jump to that file's diff
          const diff = item as GitDiff
          if (diff.patch && typeof diff.patch.diffId === 'number') {
            result.href = _getPatchHref(repo, diff.patch)
          } else {
            result.href = _getItemHref(repo, type, path, encodedBranch)
          }
        } else if (type === 'commit') {
          let moduleUrl = submodules[item.path]
          if (moduleUrl) {
            // special handling for submodules hosted in GitHub
            if (~moduleUrl.indexOf('github.com')) {
              moduleUrl = moduleUrl
                .replace(/^git(:\/\/|@)/, window.location.protocol + '//')
                .replace('github.com:', 'github.com/')
                .replace(/.git$/, '')
            }
            result.href = moduleUrl
          }
        }
      })

      // return root folders
      return folders['']
    })
}

/**
 * Returns item's href value.
 * @api protected
 */
function _getItemHref(repo: GitRepo, type: GitObjectType, path: string, encodedBranch: string) {
  const encodedPath = path
    .split('/')
    .map(encodeURIComponent)
    .join('/')
  return `/${repo.username}/${repo.reponame}/${type}/${encodedBranch}/${encodedPath}`
}
/**
 * Returns patch's href value.
 * @api protected
 */
function _getPatchHref(repo: GitRepo, patch: GitPatch) {
  return `/${repo.username}/${repo.reponame}/pull/${repo.pullNumber}/files#diff-${patch.diffId}`
}
