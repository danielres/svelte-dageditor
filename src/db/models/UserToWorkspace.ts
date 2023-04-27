import { dev } from '$app/environment'
import { sql } from 'drizzle-orm'
import { warn } from '../../lib/utils/console'
import db from '../db'
import { usersToWorkspaces } from '../schema'

export async function count() {
  const [result] = await db.select({ count: sql`COUNT(*)` }).from(usersToWorkspaces)
  return result.count
}

export async function insert(values: { userId: string; workspaceId: string; id?: string }) {
  const [result] = await db.insert(usersToWorkspaces).values(values).returning()
  return result
}

export async function truncate() {
  if (!dev) return warn('truncate() is only allowed in dev (and test)')
  return await db.delete(usersToWorkspaces).returning({ id: usersToWorkspaces.id })
}
