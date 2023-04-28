import { dev } from '$app/environment'
import { sql } from 'drizzle-orm'
import db from './db'
import { users } from './schema'

export * as User from './models/User'
export * as Workspace from './models/Workspace'
export * as UserToWorkspace from './models/UserToWorkspace'

export async function truncateAll() {
  if (!dev) throw new Error('truncateAll() should only be called in dev mode')
  const t = await getAllTables()
  const query = `TRUNCATE TABLE ${t.map((t) => `"${t}"`).join(', ')}`
  return await db.execute(sql.raw(query))
}

async function getAllTables() {
  const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
  return await db.execute(sql.raw(query)).then(({ rows }) => rows.map((r) => r.table_name))
}
