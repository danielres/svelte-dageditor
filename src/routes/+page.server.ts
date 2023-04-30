import { and, eq } from 'drizzle-orm'
import db from '../db/db'
import { Tag, Workspace } from '../db/models'
import { tagsToTags } from '../db/schema'
import { resetData } from './resetData'

export const load = (async () => {
  const workspace = await Workspace.findByName('ws1')
  const tags = await Tag.findAllByWorkspaceId(workspace.id)

  return {
    workspace,
    tags: tags.map(({ name, parentId, id }) => ({
      name,
      id,
      parentId,
    })),
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData()
    const operations = JSON.parse(formData.get('operations') as string)

    const promises = operations.map(async ({ tag, from, to }) => {
      return db
        .update(tagsToTags)
        .set({ childId: tag, parentId: to })
        .where(and(eq(tagsToTags.childId, tag), eq(tagsToTags.parentId, from)))
        .returning()
    })

    const res = await Promise.all(promises)
    console.log(res)
  },

  'reset-data': async () => await resetData(),
}
