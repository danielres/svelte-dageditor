import { afterAll, beforeAll } from 'vitest'

import crypto from 'crypto'

beforeAll(() => {
  // @ts-ignore
  global.crypto = crypto
})

afterAll(() => {
  // @ts-ignore
  delete global.crypto
})
