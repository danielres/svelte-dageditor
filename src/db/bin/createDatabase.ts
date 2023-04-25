import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export async function createDatabase(url: string) {
  const DB_NAME = url.split('/').at(-1)

  if (!DB_NAME) throw new Error('url does not contain a database name')
  const PG_URL_POSTGRES = url.replace(DB_NAME, 'postgres')

  const pool = new Pool({ connectionString: PG_URL_POSTGRES, keepAlive: false, max: 1 })
  const client = drizzle(pool, { logger: true })
  const query = 'CREATE DATABASE ' + DB_NAME

  try {
    await client.execute(sql.raw(query))
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log(`Database "${DB_NAME}" already exists`)
    } else {
      throw error
    }
  }
  await pool.end()
}
