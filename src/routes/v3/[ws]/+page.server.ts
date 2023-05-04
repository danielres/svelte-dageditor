import { isTruthy, onlyUnique } from '$lib/utils/array'
import db from '../../../db/db'
import * as tables from '../../../db/schema'
import type { PageServerLoad } from './$types'
import { eq, or } from 'drizzle-orm'

export const load = (async ({ params, parent }) => {
  const workspace = (await parent()).workspaces.find((w) => w.name === params.ws)
  if (!workspace) throw new Error(`workspace ${params.ws} not found`)

  const { tags, relations } = await db
    .select({
      tags: { id: tables.tags.id, name: tables.tags.name },
      relations: {
        id: tables.tagsToTags.id,
        parentId: tables.tagsToTags.parentId,
        childId: tables.tagsToTags.childId,
      },
    })
    .from(tables.tags)
    .where(eq(tables.tags.workspaceId, workspace.id))
    .fullJoin(tables.tagsToTags, or(eq(tables.tagsToTags.parentId, tables.tags.id)))
    .then((res) => {
      const tags = res
        .map(({ tags }) => tags)
        .filter(isTruthy)
        .filter(onlyUnique)
      const relations = res
        .map(({ relations }) => relations)
        .filter(isTruthy)
        .filter(onlyUnique)
      return { tags, relations }
    })
  return { tags, relations }
}) satisfies PageServerLoad
