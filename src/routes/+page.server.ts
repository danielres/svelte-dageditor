import { and, eq } from 'drizzle-orm'
import db from '../db/db'
import { Tag, Workspace } from '../db/models'
import { tagsToTags } from '../db/schema'
import type { Actions, PageServerLoad } from './$types'

export const load = (async () => {
  // await truncateAll()

  // await Workspace.insert({ name: 'ws1' })

  // const t1 = await Tag.insert({ name: 't1', workspaceId: ws.id })
  // const t11 = await Tag.insert({ name: 't11', workspaceId: ws.id })
  // const t111 = await Tag.insert({ name: 't111', workspaceId: ws.id })
  // const t2 = await Tag.insert({ name: 't2', workspaceId: ws.id })
  // const tx = await Tag.insert({ name: 'tx', workspaceId: ws.id })
  // const tx1 = await Tag.insert({ name: 'tx1', workspaceId: ws.id })

  // await TagToTag.insert({ parentId: t1.id, childId: t11.id })
  // await TagToTag.insert({ parentId: t11.id, childId: t111.id })
  // await TagToTag.insert({ parentId: t1.id, childId: tx.id })
  // await TagToTag.insert({ parentId: t2.id, childId: tx.id })
  // await TagToTag.insert({ parentId: tx.id, childId: tx1.id })

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
}
