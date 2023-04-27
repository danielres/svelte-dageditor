import { truncate } from '../src/db/models'
import { beforeEach } from 'vitest'

beforeEach(async () => {
  await truncate()
})
