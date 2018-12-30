import { GithubProfile, GiteaProfile } from '@/store/types'

export { GithubProfile, GiteaProfile }

export interface IAdapter {
  /**
   * 解析页面，获取仓库信息。
   * @param currentRepo 页面当前的仓库信息
   */
  parseRepo(currentRepo?: GitRepo): Promise<GitRepo>

  /**
   * 加载代码树
   * @param repo GIT仓库信息
   * @param node Git节点
   */
  loadCodeTree(repo: GitRepo, node?: GitNode): Promise<GitNode[]>

  HeaderComponent: Vue.Component
  NodeComponent: Vue.Component
  PjaxContentSelector: string
}

/**
 * Git Repo
 */
export interface GitRepo {
  readonly username: string
  readonly reponame: string
  readonly branch: string
  /**
   * PR Number，Only PR Page.
   */
  readonly pullNumber?: string
}

/**
 * Git File
 */
export interface GitFile {
  mode: string
  path: string
  sha: string
  type: GitObjectType
  url: string
}

/**
 * Git Patch
 */
export interface GitPatch {
  type: GitObjectType // maybe always 'blob'
  filename: string
  path?: string
  sha?: string
  diffId?: number
  action?: string
  additions: number
  deletions: number
  blob_url?: string
  filesChanged?: number
}

export type GitObjectType = 'tree' | 'blob' | 'commit'

/**
 * Git Diff
 */
export interface GitDiff {
  patch: GitPatch
  path: string
  sha?: string
  type: GitObjectType
  url?: string
}

/**
 * Git Submodule
 */
export interface GitSubmodule {
  [name: string]: string
}

/**
 * Git Object
 */
export type GitObject = GitDiff | GitFile

export type GitNode = GitObject & {
  id: string
  text: string
  /**
   * 下载地址
   */
  href: string
  children: GitNode[]
}
