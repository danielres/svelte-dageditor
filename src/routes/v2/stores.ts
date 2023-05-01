import { derived, get, writable } from 'svelte/store'
import { getNestedDescendants } from './stores/getNestedDescendants'

export type Relation = { parentId: string; childId: string }
type Operation = { tag: string; from: string | null; to: string | null }
export type Tag = { name: string; id: string }

export const allRelations = writable<Relation[]>([])
export const allTags = writable<Tag[]>([])

export const nextOperations = writable<Operation[]>([])
export const prevOperations = writable<Operation[]>([])

export function makeTagTreeStore(rootId: string) {
  return derived([allTags, allRelations], ([$allTags, $allRelations]) =>
    getNestedDescendants($allRelations, $allTags, rootId)
  )
}

function tagNameToTagId(name: string) {
  return get(allTags).find((t) => t.name === name)?.id
}

export function runOperation() {
  const operation = get(nextOperations)[0]
  if (!operation) return
  const { tag: tagName, from, to } = operation
  const tagId = tagNameToTagId(tagName)
  if (!tagId) return
  const relations = get(allRelations)
  const prevRelation = relations.find((r) => r.parentId === from && r.childId === tagId)
  if (!prevRelation) return
  if (!to) return
  const nextRelation = { parentId: to, childId: tagId }
  allRelations.update((r) => r.map((r) => (r === prevRelation ? nextRelation : r)))
  nextOperations.update((o) => o.slice(1))
  prevOperations.update((o) => [...o, operation])
}

export function undoOperation() {
  const operation = get(prevOperations).reverse()[0]
  if (!operation) return
  const { tag: tagName, from, to } = operation
  const tagId = tagNameToTagId(tagName)
  if (!tagId) return
  const relations = get(allRelations)
  const prevRelation = relations.find((r) => r.parentId === to && r.childId === tagId)
  if (!prevRelation) return
  if (!from) return
  const nextRelation = { parentId: from, childId: tagId }
  allRelations.update((r) => r.map((r) => (r === prevRelation ? nextRelation : r)))
  prevOperations.update((o) => o.slice(1))
  nextOperations.update((o) => [operation, ...o])
}
