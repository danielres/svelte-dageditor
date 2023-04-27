import * as string from '$lib/utils/string'
import { beforeEach, describe, expect, it } from 'vitest'
import { truncate } from '../models'
import * as User from './User'

beforeEach(async () => {
  await truncate()
})

describe('User.insert()', () => {
  it('inserts a user', async () => {
    const rand = string.rand()
    const username = 'user-' + rand
    const email = username + '@example.com'

    const actual = await User.insert({ username, email, password: '123' })
    const actualKeys = Object.keys(actual)

    const expectedKeys = ['id', 'username', 'email', 'createdAt', 'updateAt']
    expect(actualKeys.sort()).toEqual(expectedKeys.sort())

    expect(actual.email).toEqual(email)
    expect(actual.username).toEqual(username)
  })
})
