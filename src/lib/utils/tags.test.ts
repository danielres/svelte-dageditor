import { describe, it, expect } from 'vitest'
import type { Tag } from './tags'
import {
  getDescendants,
  getChildren,
  getAncestors,
  getParents,
  getSiblings,
  // getAllowedChildren,
} from './tags'

const root = { id: '<root>', parentId: null, name: 'root' }
const t1 = { id: 't1', parentId: '<root>', name: 't1' }
const t11 = { id: 't11', parentId: 't1', name: 't11' }
const t111 = { id: 't111', parentId: 't11', name: 't111' }
const t2 = { id: 't2', parentId: '<root>', name: 't2' }
const tx1 = { id: 'tx1', parentId: 'tx', name: 'tx1' }
const txa = { id: 'tx', parentId: 't1', name: 'tx' }
const txb = { id: 'tx', parentId: 't2', name: 'tx' }

const tags = [root, t1, t2, t11, t111, txa, txb, tx1]

// describe('getAllowedChildren()', () => {
//   it('returns the allowed children of a tag', () => {
//     {
//       const actual = getAllowedChildren(tags, t11)
//       const expected = [t2, txa, txb, tx1]
//       expect(actual).toEqual(expected)
//     }
//     {
//       const actual = getAllowedChildren(tags, root)
//       const expected = [t11, t111, txa, txb, tx1]
//       expect(actual).toEqual(expected)
//     }
//   })
// })

describe('getSiblings()', () => {
  it('returns the siblings of a tag', () => {
    const actual1 = getSiblings(tags, 't11')
    const expected1 = [txa]
    expect(actual1).toEqual(expected1)

    // const actual2 = getSiblings(tags, 'tx')
    // const expected2 = [tx1]
    // expect(actual2).toEqual(expected2)
  })
})

describe('getDescendants()', () => {
  it('returns the descendants of a tag', () => {
    const actual1 = getDescendants(tags, '<root>')
    const expected1 = [t1, t2, t11, txa, t111, tx1, txb]
    expect(actual1).toEqual(expected1)

    const actual2 = getDescendants(tags, 'tx')
    const expected2 = [tx1]
    expect(actual2).toEqual(expected2)
  })
})

describe('getChildren()', () => {
  it('returns the children of a tag', () => {
    const actual = getChildren(tags, '<root>')
    const expected = [t1, t2]
    expect(actual).toEqual(expected)

    const actual2 = getChildren(tags, 'tx')
    const expected2 = [tx1] as Tag[]
    expect(actual2).toEqual(expected2)
  })
})

describe('getAncestors()', () => {
  it('returns the ancestors of a tag', () => {
    const actual1 = getAncestors(tags, 'tx1')
    const expected1 = [t1, t2, txa, txb, root]
    expect(actual1).toEqual(expected1)

    const actual2 = getAncestors(tags, 'tx')
    const expected2 = [t1, t2, root]
    expect(actual2).toEqual(expected2)
  })
})

describe('getParents()', () => {
  it('returns the parents of a tag', () => {
    const actual = getParents(tags, 'tx')
    const expected = [t1, t2]
    expect(actual).toEqual(expected)

    const actual2 = getParents(tags, '<root>')
    const expected2 = [] as Tag[]
    expect(actual2).toEqual(expected2)
  })
})
