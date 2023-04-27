import { afterAll, beforeAll } from 'vitest'

beforeAll(() => {
  global.crypto = {
    randomUUID: randomUUIDPolyfill,
  }
})

afterAll(() => {
  delete global.crypto
})

function randomUUIDPolyfill() {
  const w = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)

  return `${w()}${w()}-${w()}-4d0b-${w()}-${w()}${w()}${w()}`
}
