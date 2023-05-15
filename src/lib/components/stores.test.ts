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

describe('undo/redo', () => {
  const commandsToTest2 = {
    delete: (dagStore: DagStore) => {
      const node1Id = get(dagStore).children.find((node) => node.name === 'node1')?.id
      if (!node1Id) throw new Error('node1Id or node2Id not found')
      dagStore.commands.delete({ id: node1Id })
    },
    insert: (dagStore: DagStore) => dagStore.commands.insert({ name: 'node3', parentId: 'ROOT' }),
    move: (dagStore: DagStore) => {
      const node1Id = get(dagStore).children.find((node) => node.name === 'node1')?.id
      const node2Id = get(dagStore).children.find((node) => node.name === 'node2')?.id
      if (!node1Id || !node2Id) throw new Error('node1Id or node2Id not found')
      dagStore.commands.move({ id: node2Id, from: 'ROOT', to: node1Id })
    },
    rename: (dagStore: DagStore) => {
      const node2Id = get(dagStore).children.find((node) => node.name === 'node2')?.id
      if (!node2Id) throw new Error('node2Id not found')
      dagStore.commands.rename({ id: node2Id, to: 'node2-renamed' })
    },
  }

  Object.entries(commandsToTest2).forEach(([name, commandToTest]) => {
    it(`works for commands.${name}()`, () => {
      const dagStore = makeDagStore(rootId, nodes, relations)
      const { commands } = dagStore
      commands.insert({ name: 'node1', parentId: 'ROOT' })
      commands.insert({ name: 'node2', parentId: 'ROOT' })

      const beforeCommand = structuredClone(get(dagStore))

      commandToTest(dagStore)
      const afterCommand = structuredClone(get(dagStore))

      expect(beforeCommand).not.toEqual(afterCommand)

      commands.undo()
      const afterUndo = structuredClone(get(dagStore))
      expect(afterUndo).toEqual(beforeCommand)

      commands.redo()
      const afterRedo = structuredClone(get(dagStore))
      expect(afterRedo).toEqual(afterCommand)
    })
  })
})
