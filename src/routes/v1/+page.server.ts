import type { Operation } from './types'

import { UniqueViolationError, wrapError } from 'db-errors'
import { and, eq } from 'drizzle-orm'
import { DatabaseError } from 'pg'
import db from '../../db/db'
import { Tag, Workspace } from '../../db/models'
import { tagsToTags } from '../../db/schema'
import { resetData } from './resetData'

export const load = async () => {
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
}

export const actions = {
  'apply-operations': async ({ request }) => {
    const formData = await request.formData()
    const operations = JSON.parse(formData.get('operations') as string)

    const promises = operations.map(async (operation: Operation) => {
      const { tag, from, to } = operation
      if (!from) throw new Error('from is null')
      if (!to) throw new Error('to is null')

      try {
        return await db
          .update(tagsToTags)
          .set({ childId: tag, parentId: to })
          .where(and(eq(tagsToTags.childId, tag), eq(tagsToTags.parentId, from)))
      } catch (e) {
        if (e instanceof DatabaseError) e = wrapError(e)
        if (e instanceof UniqueViolationError) console.log('UniqueViolationError')
        else console.log(e)
      }
    })

    for await (const promise of promises) await promise
  },

  'reset-data': async () => await resetData(),
}
