import db from '../db'
import { tags, tagsToTags } from '../schema'
import { eq } from 'drizzle-orm'

export async function insert(values: { parentId: string; childId: string }) {
  const [result] = await db.insert(tagsToTags).values(values).returning()
  return result
}

