import { redirect } from '@sveltejs/kit'
import { Workspace } from '../../db/models'

export const load = async ({ url }) => {
  const workspaces = await Workspace.findAll()
  const firstWorkspace = workspaces[0]
  if (url.pathname === '/v3') throw redirect(302, `/v3/${firstWorkspace.name}`)
  return { workspaces }
}
