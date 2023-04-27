import { VITE_PG_URL } from '$env/static/private'
import { warn } from '$lib/utils/console'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { out as migrationsFolder } from '../../../drizzle.config.json'
import db from '../../db/db'

export async function setup() {
  warn('VITE_PG_URL: ' + VITE_PG_URL)
  try {
    await migrate(db, { migrationsFolder })
    warn('Migrations complete')
  } catch (error) {
    console.warn('Migrations failed', error)
  }
}
