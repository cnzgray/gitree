import { GitRepo } from '../types'

// 默认分支名称的缓存
const defaultBranchCaches: { [key: string]: string | undefined } = {}

export function getBranchFormCache(username: string, reponame: string) {
  return defaultBranchCaches[`${username}/${reponame}`]
}

export function setBranchToCache(username: string, reponame: string, branch: string) {
  return defaultBranchCaches[`${username}/${reponame}`]
}
