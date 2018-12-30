import { GiteaProfiles, GithubProfile } from '@/store/types'

class Storage<T> {
  constructor(private storageKey: string, private storage: chrome.storage.StorageArea = chrome.storage.local) {}

  loadData() {
    return new Promise<T>((resolve, reject) => {
      this.storage.get(this.storageKey, items => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message)
        else {
          const value = items[this.storageKey]
          if (value) resolve(value)
          reject()
        }
      })
    })
  }

  saveData(value: T) {
    return new Promise<void>((resolve, reject) => {
      this.storage.set({ [this.storageKey]: value }, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message)
        else resolve()
      })
    })
  }
}

export const GithubStore = new Storage<GithubProfile>('github')
export const GiteaStore = new Storage<GiteaProfiles>('gitea')
