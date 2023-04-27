import { sql } from 'drizzle-orm'
import db from './db'
import { users } from './schema'

export * as User from './models/User'
export * as Workspace from './models/Workspace'
export * as UserToWorkspace from './models/UserToWorkspace'

type Table = 'users' | 'workspaces' | 'usersToWorkspaces'

export async function truncate(...tables: Table[]) {
  if (!tables.length) tables = ['users', 'workspaces', 'usersToWorkspaces']
  return tables.map(async (table) => {
    await db.execute(sql.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`))
  })
}
