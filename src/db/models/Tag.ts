import { eq } from 'drizzle-orm'
import db from '../db'
import { tags, tagsToTags } from '../schema'

export async function insert(values: { name: string; workspaceId: string }) {
  const result = await db
    .insert(tags)
    .values(values)
    .returning()
    .then(([tags]) => tags)

  return result
}

export async function findByName(name: string) {
  const [result] = await db.select({ tags }).from(tags).where(eq(tags.name, name))
  return result?.tags
}

export async function findAllByWorkspaceId(workspaceId: string) {
  const { workspaceId: _, ...rest } = tags

  return await db
    .select({ tags: rest, parentId: tagsToTags.parentId })
    .from(tags)
    .leftJoin(tagsToTags, eq(tagsToTags.childId, tags.id))
    .where(eq(tags.workspaceId, workspaceId))
    .orderBy(tags.name)
    .then((res) =>
      res.map(({ tags, parentId }) => {
        return { ...tags, parentId }
      })
    )
}
