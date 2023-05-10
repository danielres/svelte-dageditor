import type { Writable } from 'svelte/store'

import { isTruthy, onlyUnique } from '$lib/utils/array'
import { derived, get, writable, readonly } from 'svelte/store'

export type TreeStore = ReturnType<typeof makeTreeStore>
export type Relation = { id: string; parentId: string; childId: string }
export type Node = { id: string; name: string }
export type Branch = Node & { children: Branch[] }
export type Command = CommandMove | CommandRename | CommandInsert | CommandAddLinkedCopy

type CommandAddLinkedCopy = { kind: 'add-linked-copy'; id: string; parentId: string }
type CommandMove = { kind: 'move'; id: string; from: string; to: string }
type CommandRename = { kind: 'rename'; id: string; from: string; to: string }
type CommandInsert = { kind: 'insert'; id: string; name: string; parentId: string }

export function makeTreeStore(rootId: string, tags: Node[], relations: Relation[], maxDepth = 10) {
  const draggedStore = writable<Branch | null>(null)
  const historyStore = writable<Command[]>([])
  const relationsStore = writable<Relation[]>(relations)
  const tagsStore = writable<Node[]>(tags)
  const commandsStore = makeCommandsStore(tagsStore, relationsStore, historyStore)

  const tree = derived([tagsStore, relationsStore], ([$tags, $relations]) => {
    const root = $tags.find((t) => t.id === rootId)
    if (!root) throw new Error(`root tag ${rootId} not found`)
    return getBranch(root, $tags, $relations, maxDepth - 1)
  })

  return {
    ...tree,
    commands: {
      ...readonly(commandsStore),
      history: readonly(historyStore),
      copy: {
        linked: {
          add: (data: { id: string; parentId: string }) => {
            const command = { kind: 'add-linked-copy', ...data } as const
            commandsStore.add(command).exec()
          },
        },
      },
      move: (data: { id: string; from: string; to: string }) => {
        const command = { kind: 'move', ...data } as const
        commandsStore.add(command).exec()
      },
      rename: (data: { id: string; from: string; to: string }) => {
        const command = { kind: 'rename', ...data } as const
        commandsStore.add(command).exec()
      },
      insert: (data: { name: string; parentId: string }) => {
        const command = { kind: 'insert', id: crypto.randomUUID(), ...data } as const
        commandsStore.add(command).exec()
      },
      undo: () => undo(historyStore, commandsStore, relationsStore, tagsStore),
      redo: () => commandsStore.exec(),
      undos: derived(historyStore, ($history) => $history.length),
      redos: derived(commandsStore, ($commands) => $commands.length),
    },
    dragged: {
      ...readonly(draggedStore),
      clear: () => draggedStore.set(null),
      set: draggedStore.set,
      ids: derived(draggedStore, getBranchIds),
    },
    relations: readonly(relationsStore),
    tags: readonly(tagsStore),
  }
}

function exec(
  commandStore: Writable<Command[]>,
  tagsStore: Writable<Node[]>,
  relationsStore: Writable<Relation[]>,
  historyStore: Writable<Command[]>
) {
  const command = get(commandStore)[0]
  if (!command) return
  switch (command.kind) {
    case 'add-linked-copy':
      const original = get(tagsStore).find((t) => t.id === command.id)
      if (!original) return
      const parent = get(tagsStore).find((t) => t.id === command.parentId)
      tagsStore.update(($tags) => [...$tags, original])
      relationsStore.update(($relations) => [
        ...$relations,
        { id: crypto.randomUUID(), parentId: command.parentId, childId: command.id },
      ])
      break

    case 'insert':
      tagsStore.update(($tags) => [...$tags, { id: command.id, name: command.name }])
      relationsStore.update(($relations) => [
        ...$relations,
        { id: crypto.randomUUID(), parentId: command.parentId, childId: command.id },
      ])
      break

    case 'move':
      relationsStore.update(($relations) => {
        let foundOne = false
        return $relations.map((relation) => {
          if (foundOne || relation.childId !== command.id || relation.parentId !== command.from)
            return relation
          foundOne = true
          return { ...relation, parentId: command.to }
        })
      })
      break

    case 'rename':
      tagsStore.update(($tags) =>
        $tags.map((t) => (t.id === command.id ? { ...t, name: command.to } : t))
      )
      break

    default:
      return
  }

  commandStore.update(($commands) => $commands.slice(1))
  historyStore.update(($history) => [...$history, command])
}

function undo(
  historyStore: Writable<Command[]>,
  commandsStore: ReturnType<typeof makeCommandsStore>,
  relationsStore: Writable<Relation[]>,
  tagsStore: Writable<Node[]>
) {
  const history = get(historyStore)
  if (!history.length) return
  const command = history[history.length - 1]
  historyStore.update(($history) => $history.slice(0, -1))
  commandsStore.add(command)

  switch (command.kind) {
    case 'insert':
      tagsStore.update(($tags) => $tags.filter((t) => t.id !== command.id))
      relationsStore.update(($relations) => $relations.filter((r) => r.childId !== command.id))
      break

    case 'move':
      relationsStore.update(($relations) => {
        return $relations.map((relation) => {
          if (relation.childId !== command.id || relation.parentId !== command.to) return relation
          return { ...relation, parentId: command.from }
        })
      })
      break

    case 'rename':
      tagsStore.update(($tags) =>
        $tags.map((t) => (t.id === command.id ? { ...t, name: command.from } : t))
      )
      break

    default:
      break
  }
}

function makeCommandsStore(
  tagsStore: Writable<Node[]>,
  relationsStore: Writable<Relation[]>,
  historyStore: Writable<Command[]>
) {
  const store = writable<Command[]>([])
  return {
    ...store,
    add(command: Command) {
      this.update(($commands) => [...$commands, command])
      return this
    },
    exec: () => exec(store, tagsStore, relationsStore, historyStore),
  }
}

function getChildren(parentId: string, tags: Node[], relations: Relation[]) {
  return relations
    .filter((r) => r.parentId === parentId)
    .map((r) => tags.find((t) => t.id === r.childId))
    .filter(isTruthy)
}

function getBranch(
  node: Node,
  nodes: Node[],
  relations: Relation[],
  maxDepth: number,
  depth = 0
): Branch {
  const children =
    depth > maxDepth
      ? []
      : getChildren(node.id, nodes, relations)
          .map((child) => getBranch(child, nodes, relations, maxDepth, depth + 1))
          .sort(byName)

  return { ...node, children }
}

function getBranchIds(tagWithChildren: Branch | null): Node['id'][] {
  if (!tagWithChildren) return []
  const { children, ...rest } = tagWithChildren
  return [rest.id, ...children.flatMap(getBranchIds)].filter(onlyUnique)
}

function byName(a: Node, b: Node) {
  if (a.name > b.name) return 1
  if (a.name < b.name) return -1
  return 0
}
