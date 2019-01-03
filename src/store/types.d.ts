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
  showOnlyChangedInPR?: boolean
  showInNonCodePage?: boolean
}

export type GiteaProfiles = GiteaProfile[]
