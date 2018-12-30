import { GithubStore, GiteaStore } from '@/store'
import { detectGithub } from './github'
import { detectGitea } from './gitea'
import { IAdapter } from '@/content/adapter/types'

type Adapter = IAdapter | undefined
export function createAdapter() {
  const profiles = Promise.all([GithubStore.loadData(), GiteaStore.loadData()])
  return profiles.then(([github, gitea]) => {
    const url = `${location.protocol}//${location.host}`
    let adapter: Adapter = detectGithub(url, github)
    if (adapter) return adapter

    adapter = detectGitea(url, gitea)
    if (adapter) return adapter

    throw new Error('can not detect adapter!')
  })
}
