import type { Operation, Relation, Tag } from './types'

import { tick } from 'svelte'
import { derived, get, writable } from 'svelte/store'
import { getNestedDescendants } from './stores/getNestedDescendants'

export const relationsStore = writable<Relation[]>([])
export const tagsStore = writable<Tag[]>([])

export const nextOperations = writable<Operation[]>([])
export const prevOperations = writable<Operation[]>([])

export function makeTagTreeStore(rootId: string) {
  return derived([tagsStore, relationsStore], ([$allTags, $allRelations]) => {
    return getNestedDescendants($allRelations, $allTags, rootId)
  })
}

function tagNameToTagId(name: string) {
  return get(tagsStore).find((t) => t.name === name)?.id
}

export async function runOperation() {
  await tick()
  const operation = get(nextOperations)[0]
  if (!operation) return
  const { tag: tagName, from, to } = operation
  const tagId = tagNameToTagId(tagName)
  if (!tagId) return
  const relations = get(relationsStore)
  const prevRelation = relations.find((r) => r.parentId === from && r.childId === tagId)
  if (!prevRelation) return
  if (!to) return
  const nextRelation = { parentId: to, childId: tagId }
  relationsStore.update((r) => r.map((r) => (r === prevRelation ? nextRelation : r)))
  nextOperations.update((o) => o.slice(1))
  prevOperations.update((o) => [...o, operation])
}

export function undoOperation() {
  const operation = get(prevOperations).reverse()[0]
  if (!operation) return
  const { tag: tagName, from, to } = operation
  const tagId = tagNameToTagId(tagName)
  if (!tagId) return
  const relations = get(relationsStore)
  const prevRelation = relations.find((r) => r.parentId === to && r.childId === tagId)
  if (!prevRelation) return
  if (!from) return
  const nextRelation = { parentId: from, childId: tagId }
  relationsStore.update((r) => r.map((r) => (r === prevRelation ? nextRelation : r)))
  prevOperations.update((o) => o.slice(1))
  nextOperations.update((o) => [operation, ...o])
}
