import { dev } from '$app/environment'
import { eq, sql } from 'drizzle-orm'
import { warn } from '../../lib/utils/console'
import db from '../db'
import { users, usersToWorkspaces, workspaces } from '../schema'

export async function count() {
  const [result] = await db.select({ count: sql`COUNT(*)` }).from(users)
  return result.count
}

export async function insert(values: {
  id?: string
  email: string
  username: string
  password: string
}) {
  const result = await db
    .insert(users)
    .values(values)
    .returning()
    .execute()
    .then(([users]) => users)
    .then(({ password, ...user }) => user)

  return result
}

export async function findUserById(id: string, options = {}) {
  const { password, ...rest } = users
  const _options = { password: false, ...options }
  const [result] = await db
    .select({ users: _options.password ? users : rest })
    .from(users)
    .where(eq(users.id, id))
  return result?.users
}

export async function findUserWithWorkspacesById(id: string, options = {}) {
  const { password, ...rest } = users
  const _options = { password: false, ...options }

  const userWithWorkspaces = await db
    .select({ users: _options.password ? users : rest, workspaces, usersToWorkspaces })
    .from(users)
    .where(eq(users.id, id))
    .leftJoin(usersToWorkspaces, eq(usersToWorkspaces.userId, users.id))
    .leftJoin(workspaces, eq(usersToWorkspaces.workspaceId, workspaces.id))
    .then((results) => {
      const user = results[0].users
      const workspaces = results.map((result) => ({
        ...result.workspaces,
        meta: { joinedAt: result.usersToWorkspaces?.createdAt },
      }))
      return { ...user, workspaces }
    })

  return userWithWorkspaces
}

export async function truncate() {
  if (!dev) return warn('truncate() is only allowed in dev (and test)')
  return await db.delete(users).returning({ id: users.id }).execute()
}
