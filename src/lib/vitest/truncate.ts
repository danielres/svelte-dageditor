import { beforeEach } from 'vitest'
import { truncateAll } from '../../db/models'

beforeEach(async () => {
  await truncateAll()
})
