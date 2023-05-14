import { describe, it, expect, test, afterEach } from 'vitest'
import { makeDagStore, type DagStore, type Relation } from './stores'
import { get } from 'svelte/store'

const rootId = 'ROOT'
const nodes = [{ id: rootId, name: 'ROOT' }]
const relations: Relation[] = []

describe(makeDagStore.name, () => {
  it('returns a store containing a DAG', () => {
    const dagStore = makeDagStore(rootId, nodes, relations)
    const actual = get(dagStore)
    const expected = { id: 'ROOT', name: 'ROOT', children: [] }

    expect(actual).toEqual(expected)
  })
})

describe('commands', () => {
  describe('insert', () => {
    it('inserts a node', () => {
      const dagStore = makeDagStore(rootId, nodes, relations)
      const { commands } = dagStore

      commands.insert({ name: 'new node', parentId: 'ROOT' })

      const actual = get(dagStore)
      const id = actual.children[0].id
      expect(id).toBeTruthy()

      const expected = {
        id: 'ROOT',
        name: 'ROOT',
        children: [{ id, name: 'new node', children: [] }],
      }

      expect(actual).toEqual(expected)
    })
  })
})
