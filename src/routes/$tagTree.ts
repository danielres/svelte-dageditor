import type { Operation } from './types'

import { derived, writable } from 'svelte/store'

const store = writable<Operation[]>([])

export const opsStore = {
  ...store,
  add: (operation: Operation) => store.update((ops) => [...ops, operation]),
  reset: () => store.set([]),
}

export const opsStoreOptimized = derived(opsStore, ($opsStore) =>
  $opsStore.reduce((acc, cur) => {
    const found = acc.find((stored) => stored.tag === cur.tag)
    acc = acc.filter((stored) => stored.tag !== cur.tag)
    return [...acc, { ...cur, from: found?.from ?? cur.from }]
  }, [] as Operation[])
)
