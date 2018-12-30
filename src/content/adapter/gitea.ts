import { normalizeUrl } from '@/utils/url'
import { GiteaProfiles, GiteaProfile } from '@/store/types'
import { IAdapter, GitRepo, GitDiff, GitNode } from './types'

export function detectGitea(currentUrl: string, profiles: GiteaProfiles) {
  const profile = profiles.find(p => currentUrl == normalizeUrl(p.url))
  if (profile) return new GiteaAdaptor(profile)
}

export class GiteaAdaptor implements IAdapter {
  constructor(private profile: GiteaProfile) {}

  parseRepo(currentRepo?: GitRepo): Promise<GitRepo> {
    throw new Error('Method not implemented.')
  }

  loadCodeTree(repo: GitRepo, node?: GitNode): Promise<GitNode[]> {
    throw new Error('Method not implemented.')
  }
}
