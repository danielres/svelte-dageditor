import { isTruthy, onlyUnique } from '$lib/utils/array'
import { derived, get, writable } from 'svelte/store'

type Relation = { id: string; parentId: string; childId: string }
type Tag = { id: string; name: string }
export type TagWithChildren = Tag & { children: TagWithChildren[] }

export const tagsStore = writable<Tag[]>([])
export const relationsStore = writable<Relation[]>([])
export const draggedStore = writable<TagWithChildren | null>(null)

export const historyStore = writable<Command[]>([])

type Command = { kind: 'move'; id: string; from: string; to: string }
const _commandsStore = writable<Command[]>([])
export const commandsStore = {
  add(command: Command) {
    _commandsStore.update(($commands) => [...$commands, command])
    return this
  },
  exec() {
    const commands = get(_commandsStore)
    const command = commands[0]
    if (!command) return
    const { kind, id, from, to } = command
    _commandsStore.update(($commands) => $commands.slice(1))
    relationsStore.update(($relations) => {
      return $relations.map((relation) => {
        if (relation.childId !== id || relation.parentId !== from) return relation
        return { ...relation, parentId: to }
      })
    })
    historyStore.update(($history) => [...$history, { kind, id, from, to }])
  },
  subscribe: _commandsStore.subscribe,
}

export function makeTreeStore(rootId: string, tags: Tag[], relations: Relation[]) {
  tagsStore.set(tags)
  relationsStore.set(relations)

  return {
    tree: derived([tagsStore, relationsStore], ([$tags, $relations]) => {
      const root = $tags.find((t) => t.id === rootId)
      if (!root) throw new Error(`root tag ${rootId} not found`)

      return {
        ...root,
        children: getBranch(root.id, $tags, $relations),
      }
    }),
    undo() {
      const history = get(historyStore)
      if (!history.length) return
      const { kind, id, from, to } = history[history.length - 1]
      historyStore.update(($history) => $history.slice(0, -1))
      commandsStore.add({ kind, id, from, to })

      relationsStore.update(($relations) => {
        return $relations.map((relation) => {
          if (relation.childId !== id || relation.parentId !== to) return relation
          return { ...relation, parentId: from }
        })
      })
    },
    redo: commandsStore.exec,
    undos: derived(historyStore, ($history) => $history.length),
    redos: derived(commandsStore, ($commands) => $commands.length),
  }
}

function getChildren(parentId: string, tags: Tag[], relations: Relation[]) {
  return relations
    .filter((r) => r.parentId === parentId)
    .map((r) => tags.find((t) => t.id === r.childId))
    .filter(isTruthy)
}

export function getBranch(parentId: string, tags: Tag[], relations: Relation[]): TagWithChildren[] {
  const children = getChildren(parentId, tags, relations)

  return children.map((child) => ({
    ...child,
    children: getBranch(child.id, tags, relations),
  }))
}

export function getBranchIds(tagWithChildren: TagWithChildren | null): Tag['id'][] {
  if (!tagWithChildren) return []
  const { children, ...rest } = tagWithChildren
  return [rest.id, ...children.flatMap(getBranchIds)].filter(onlyUnique)
}
