import { GitSubmodule as GitSubmodules } from '../types'

const INI_SECTION = /^\s*\[\s*([^\]]*)\s*\]\s*$/
const INI_COMMENT = /^\s*;.*$/
const INI_PARAM = /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/
const SEPARATOR = /\r\n|\r|\n/

export function parseGitmodules(atob: string): GitSubmodules {
  const submodules: GitSubmodules = {}
  const lines = atob.split(SEPARATOR)
  let lastPath: string

  lines.forEach(line => {
    let match
    if (INI_SECTION.test(line) || INI_COMMENT.test(line) || !(match = line.match(INI_PARAM))) {
      return
    }

    if (match[1] === 'path') lastPath = match[2]
    else if (match[1] === 'url') submodules[lastPath] = match[2]
  })

  return submodules
}
