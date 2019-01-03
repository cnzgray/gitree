// prettier-ignore
export const GT_RESERVED_USER_NAMES = [
  'explore', 'user', 'admin', 'attachments',
  'org', 'repo'
    // 'settings', 'orgs', 'organizations',
    // 'site', 'blog', 'about', 'explore',
    // 'styleguide', 'showcases', 'trending',
    // 'stars', 'dashboard', 'notifications',
    // 'search', 'developer', 'account',
    // 'pulls', 'issues', 'features', 'contact',
    // 'security', 'join', 'login', 'watching',
    // 'new', 'integrations', 'gist', 'business',
    // 'mirrors', 'open-source', 'personal',
    // 'pricing'
  ]
// prettier-ignore
export const GT_RESERVED_REPO_NAMES = ['followers', 'following']

export const GT_404_SEL = 'img[alt="404"]'
export const GT_RAW_CONTENT = 'body > pre'

/**
 * 默认配置
 */
export const DEFAULT_PROFILE = Object.freeze({
  showOnlyChangedInPR: true,
  showInNonCodePage: true
})
