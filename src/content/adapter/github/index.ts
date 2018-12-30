import { attr, data as domData } from '@/utils/dom'
import { normalizeUrl } from '@/utils/url'
import { GithubProfile, GitRepo, IAdapter, GitNode } from '../types'
import { requestApi, requestCodeTree } from './api'
import {
  GH_404_SEL,
  GH_RAW_CONTENT,
  GH_RESERVED_REPO_NAMES,
  GH_RESERVED_USER_NAMES,
  DEFAULT_PROFILE,
  GH_PJAX_CONTAINER_SEL
} from './const'
import { getBranchFormCache, setBranchToCache } from '../utils/cache'
import HeaderComponent from './Header.vue'
import NodeComponent from './Node.vue'

export function detectGithub(currentUrl: string, profile: GithubProfile) {
  const urls = ['https://github.com'].concat(profile.urls.map(normalizeUrl))
  if (urls.indexOf(currentUrl) >= 0) return new GithubAdaptor(profile)
}

export class GithubAdaptor implements IAdapter {
  /** Github配置 */
  private readonly profile: GithubProfile

  constructor(profile: GithubProfile) {
    this.profile = {
      ...DEFAULT_PROFILE,
      ...profile
    }
  }

  get HeaderComponent() {
    return HeaderComponent
  }
  get NodeComponent() {
    return NodeComponent
  }

  get PjaxContentSelector() {
    return GH_PJAX_CONTAINER_SEL
  }

  /**
   * 解析页面，获取仓库信息。
   * @param currentRepo 页面当前的仓库信息
   */
  parseRepo(currentRepo?: GitRepo): Promise<GitRepo> {
    const { showOnlyChangedInPR, showInNonCodePage } = this.profile

    // 404 page, skip
    if (document.getElementById(GH_404_SEL)) return Promise.reject()

    // Skip raw page
    if (document.querySelector(GH_RAW_CONTENT)) return Promise.reject()

    // (username)/(reponame)[/(type)][/(typeId)]
    const match = window.location.pathname.match(/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/)
    if (!match) return Promise.reject()

    const username = match[1]
    const reponame = match[2]
    const type = match[3]
    const typeId = match[4]

    // Not a repository, skip
    if (~GH_RESERVED_USER_NAMES.indexOf(username) || ~GH_RESERVED_REPO_NAMES.indexOf(reponame)) return Promise.reject()

    // Check if this is a PR and whether we should show changes
    const isPR = type === 'pull'
    const pullNumber = isPR && showOnlyChangedInPR ? typeId : undefined

    // Skip non-code page unless showInNonCodePage is true
    if (!showInNonCodePage && type && !~['tree', 'blob'].indexOf(type)) return Promise.reject()

    // Get branch by inspecting page, quite fragile so provide multiple fallbacks
    const branch =
      // Code page
      domData('.branch-select-menu .select-menu-item.selected', 'name') ||
      // Pull requests page
      ((attr('.commit-ref.base-ref', 'title') || ':').match(/:(.*)/) || [])[1] ||
      // Reuse last selected branch if exist
      (currentRepo && currentRepo.username === username && currentRepo.reponame === reponame && currentRepo.branch) ||
      // Get default branch from cache
      getBranchFormCache(username, reponame)

    if (branch) {
      return Promise.resolve({ username, reponame, branch, pullNumber })
    } else {
      return requestApi({ username, reponame, token: this.profile.accessKey }).then(
        data => {
          const branch = data.default_branch
          if (branch) setBranchToCache(username, reponame, branch)
          return { username, reponame, branch, pullNumber }
        },
        error => {
          throw error // continue throw
        }
      )
    }
  }

  /**
   * 加载代码树
   * @param repo GIT仓库信息
   * @param node Git节点
   */
  loadCodeTree(repo: GitRepo, node?: GitNode): Promise<GitNode[]> {
    return requestCodeTree(repo, node, this.profile.accessKey)
  }

  detectCurrentPath() {
    const path = decodeURIComponent(location.pathname)
    const match = path.match(/(?:[^\/]+\/){4}(.*)/)
    if (!match) return

    return match[1]
  }
}
