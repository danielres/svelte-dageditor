import { beforeEach } from 'vitest'
import { truncate } from '../../db/models'

beforeEach(async () => {
  await truncate()
})
