import { GithubStore, GiteaStore } from '@/store'

export function requestPermissions() {
  return Promise.all([GithubStore.loadData(), GiteaStore.loadData()]).then(([github, gitea]) => {
    const urls = ([] as string[]).concat(github.urls).concat((gitea || []).map(v => v.url))
    return new Promise(resolve => {
      if (chrome.runtime.lastError) throw new Error(chrome.runtime.lastError.message)

      chrome.runtime.sendMessage({ type: 'requestPermissions', urls: urls }, granted => resolve(granted))
    })
  })
}
