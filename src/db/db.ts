import { dev } from '$app/environment'
import { VITE_PG_URL } from '$env/static/private'
import { warn } from '$lib/utils/console'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

// if (dev) warn('VITE_PG_URL: ' + VITE_PG_URL)

const pool = new Pool({ connectionString: VITE_PG_URL, keepAlive: false, max: 1 })
const db = drizzle(pool)

export default db
