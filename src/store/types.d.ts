/** Github Config */
export interface GithubProfile {
  /** Access Key */
  accessKey?: string
  /** Enterprise URLs */
  urls: string[]
  showOnlyChangedInPR?: boolean
  showInNonCodePage?: boolean
}

/** Gitea Config */
export interface GiteaProfile {
  /** Access Key */
  accessKey?: string
  /** URLs */
  url: string
}

export type GiteaProfiles = GiteaProfile[]
