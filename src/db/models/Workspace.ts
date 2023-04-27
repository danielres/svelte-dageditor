import { dev } from '$app/environment'
import { eq, sql } from 'drizzle-orm'
import { warn } from '../../lib/utils/console'
import db from '../db'
import { users, usersToWorkspaces, workspaces } from '../schema'

export async function count() {
  const [result] = await db.select({ count: sql`COUNT(*)` }).from(workspaces)
  return result.count
}

export async function truncate() {
  if (!dev) return warn('truncate() is only allowed in dev (and test)')
  return await db.delete(workspaces).returning({ id: workspaces.id }).execute()
}

export async function insert(values: { id?: string; name: string }) {
  return await db
    .insert(workspaces)
    .values(values)
    .returning()
    .then((res) => res[0])
}

export async function findWorkspaceWithUsersById(id: string, options = {} as const) {
  const { password, ...rest } = users
  const _options = { password: false, ...options } as const

  return await db
    .select({ users: _options.password ? users : rest, workspaces, usersToWorkspaces })
    .from(workspaces)
    .leftJoin(usersToWorkspaces, eq(usersToWorkspaces.workspaceId, workspaces.id))
    .leftJoin(users, eq(usersToWorkspaces.userId, users.id))
    .where(eq(workspaces.id, id))
    .execute()
    .then((results) => {
      const workspace = results[0].workspaces
      const users = results
        .filter(({ users }) => users)
        .map((result) => ({
          ...result.users,
          meta: { joinedAt: result.usersToWorkspaces?.createdAt },
        }))
      return { ...workspace, users }
    })
}

export async function findWorkspacesByUserId(userId: string) {
  return await db
    .select({ workspaces, usersToWorkspaces })
    .from(usersToWorkspaces)
    .leftJoin(workspaces, eq(usersToWorkspaces.workspaceId, workspaces.id))
    .where(eq(usersToWorkspaces.userId, userId))
    .execute()
    .then((results) => {
      return results.map((result) => ({
        ...result.workspaces,
        meta: { joinedAt: result.usersToWorkspaces?.createdAt },
      }))
    })
}
