import { dev } from '$app/environment'
import { PG_URL } from '$env/static/private'
import { warn } from '$lib/utils/console'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { out as migrationsFolder } from '../../drizzle.config.json'

if (dev) warn('PG_URL: ' + PG_URL)

const pool = new Pool({ connectionString: PG_URL, keepAlive: false, max: 1 })
const db = drizzle(pool)

await migrate(db, { migrationsFolder })
warn('Migrations complete')

export default db
