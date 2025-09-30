import { type Plugin } from 'csp-plugin'

import { remotes } from './remotes'

export async function loadRemotesPlugins(remotesList = remotes) {
  const modules: Array<{ default: Plugin }> = await Promise.all(remotesList)
  const defaults = modules.map(mod => mod.default)
  return defaults
}
