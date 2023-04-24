import { dev } from '$app/environment'
import crypto from 'crypto'
import { sql } from 'drizzle-orm'
import { warn } from '../../lib/utils/console'
import db from '../db'
import { users } from '../schema/users'

export async function count() {
  const [result] = await db.select({ count: sql`COUNT(*)` }).from(users)
  return result.count
}

type InsertValues = { id?: string; email: string; username: string; password: string }
export async function insert(values: InsertValues) {
  const result = await db
    .insert(users)
    .values({ id: values.id || crypto.randomUUID(), ...values })
    .returning()
    .execute()
    .then((users) => users[0])
    .then(({ password, ...user }) => user) // eslint-disable-line @typescript-eslint/no-unused-vars

  return result
}

export async function truncate() {
  if (!dev) return warn('truncate() is only allowed in dev (and test)')
  return await db.delete(users).returning({ id: users.id }).execute()
}
