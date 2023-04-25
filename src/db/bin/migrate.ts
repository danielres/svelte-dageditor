import type { Logger } from 'drizzle-orm'

import { muted, warn } from '$lib/utils/console'
import { dedent, removeBlankLines } from '$lib/utils/string'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { out as migrationsFolder } from '../../../drizzle.config.json'
import { createDatabase } from './createDatabase'

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log(''.padEnd(80, '-'))
    console.log(removeBlankLines(dedent(query)))
    if (params.length > 0) params.map((p, i) => muted(`$${i + 1}: ${p}`))
  }
}

export const PG_URL = import.meta.env.VITE_PG_URL
if (!PG_URL) throw new Error('PG_URL is not defined')
warn('PG_URL: ' + PG_URL)

async function run() {
  const pool = new Pool({ connectionString: PG_URL, keepAlive: false, max: 1 })
  const migrationsClient = drizzle(pool, { logger: new MyLogger() })

  warn('Migrating database...')
  const start = Date.now()
  await migrate(migrationsClient, { migrationsFolder })
  const end = Date.now()
  warn(`Migrations complete in ${end - start}ms`)

  process.exit(0)
}

try {
  await createDatabase(PG_URL)
  await run()
} catch (error) {
  console.error('Error running migrations')
  console.error(error)
  process.exit(1)
}
