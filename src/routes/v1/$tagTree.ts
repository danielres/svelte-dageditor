import { getAncestors, type Tag } from '$lib/utils/tags'
import type { Operation } from './types'

import { derived, writable } from 'svelte/store'

const store = writable<Operation[]>([])

export const opsStore = {
  ...store,
  add: (operation: Operation) => store.update((ops) => [...ops, operation]),
  reset: () => store.set([]),
}

export const allTags = writable<Tag[]>([])

export const opsStoreAllowed = derived([opsStore, allTags], ([$opsStore, $allTags]) =>
  $opsStore.reduce((acc, cur) => {
    // prevent if no destination
    if (!cur.to) return acc

    // prevent if tag was dropped on itself
    if (cur.tag === cur.to) return acc

    // prevent if tag was dropped on its ancestor (avoids infinite loops)
    const ancestors = getAncestors($allTags, cur.to)
    if (ancestors.some((ancestor) => ancestor.id === cur.tag)) return acc

    // otherwise, allow operation
    return [...acc, cur]
  }, [] as Operation[])
)

export const opsStoreOptimized = derived(opsStoreAllowed, ($opsStore) =>
  $opsStore.reduce((acc, cur) => {
    const found = acc.find((stored) => stored.tag === cur.tag)
    acc = acc.filter((stored) => stored.tag !== cur.tag)
    return [...acc, { ...cur, from: found?.from ?? cur.from }]
  }, [] as Operation[])
)
