import type { Actions, PageServerLoad } from './$types'

import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import db from '../../db/db'
import { Workspace } from '../../db/models'
import * as tables from '../../db/schema'
import { resetData } from './resetData'

export const load = (async () => {
  const ws = await Workspace.findByName('ws1')

  if (!ws) {
    await resetData()
    throw redirect(302, '/')
  }

  const { tags, tagsToTags } = tables

  const results = await db
    .select({
      tags: { id: tags.id, name: tags.name },
      relations: { parentId: tagsToTags.parentId, childId: tagsToTags.childId },
    })
    .from(tags)
    .innerJoin(tagsToTags, eq(tagsToTags.childId, tags.id))
    .where(eq(tags.workspaceId, ws.id))
    .orderBy(tags.name)
    .then((res) => {
      return {
        tags: res.map(({ tags }) => tags),
        relations: res.map(({ relations }) => relations),
      }
    })

  return {
    tags: results.tags,
    relations: results.relations,
    workspace: ws,
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  'reset-data': async () => await resetData(),
}
