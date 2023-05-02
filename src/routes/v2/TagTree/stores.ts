import type { Operation, Relation, Tag } from './types'

import { tick } from 'svelte'
import { derived, get, writable } from 'svelte/store'
import { getNestedDescendants } from './stores/getNestedDescendants'
import { isTruthy, onlyUnique } from '$lib/utils/array'

const MAX_RECURSION_DEPTH = 10

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

function getParents(tags: Tag[], tagId: string) {
  const relations = get(relationsStore).filter((relation) => tagId.includes(relation.childId))
  const parentIds = relations.map((t) => t.parentId).filter(isTruthy)
  return tags.filter((tag) => parentIds.includes(tag.id))
}

function getAncestors(tags: Tag[], tagId: string, depth = 0): Tag[] {
  const parents = getParents(tags, tagId)
  if (depth > MAX_RECURSION_DEPTH) return parents
  const ancestors = parents.flatMap((parent) => getAncestors(tags, parent.id, depth + 1))
  return [...parents, ...ancestors].filter(onlyUnique)
}

export function isAllowedOperation({ tag, to }: Operation) {
  if (!to || !tag) return false
  if (tag === to) return false
  const toId = tagNameToTagId(to)
  if (!toId) return false
  const ancestors = getAncestors(get(tagsStore), toId)
  if (ancestors.some((ancestor) => ancestor.name === tag)) return false
  return true
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
