import type { Writable } from 'svelte/store'

import { isTruthy, onlyUnique } from '$lib/utils/array'
import { createNodeId, createRelationId } from '$lib/utils/dag'
import { derived, get, readonly, writable } from 'svelte/store'

export type DagStore = ReturnType<typeof makeDagStore>
export type Relation = { id: string; parentId: string; childId: string }
export type Node = { id: string; name: string }
export type Branch = Node & { children: Branch[] }
export type Command =
  | CommandAddLinkedCopy
  | CommandDelete
  | CommandInsert
  | CommandMove
  | CommandRemoveLinkedCopy
  | CommandRename

type CommandAddLinkedCopy = { kind: 'add-linked-copy'; id: string; parentId: string }
type CommandDelete = { kind: 'delete'; node: Node; parentId: string; childrenIds: string[] }
type CommandInsert = { kind: 'insert'; id: string; name: string; parentId: string }
type CommandMove = { kind: 'move'; id: string; from: string; to: string }
type CommandRemoveLinkedCopy = { kind: 'remove-linked-copy'; id: string; parentId: string }
type CommandRename = { kind: 'rename'; id: string; from: string; to: string }

type Config = {
  maxDepth: number
  createNodeId: (nodeName: string) => string
  createRelationId: () => string
}

export function makeDagStore(
  rootId: string,
  nodes: Node[],
  relations: Relation[],
  config: Partial<Config> = {}
) {
  const conf: Config = {
    maxDepth: 10,
    createNodeId,
    createRelationId,
    ...config,
  }

  const draggedStore = writable<Branch | null>(null)
  const historyStore = writable<Command[]>([])
  const relationsStore = writable<Relation[]>(relations)
  const nodesStore = writable<Node[]>(nodes)
  const commandsStore = makeCommandsStore(nodesStore, relationsStore, historyStore)

  const dag = derived([nodesStore, relationsStore], ([$nodes, $relations]) => {
    const root = $nodes.find((t) => t.id === rootId)
    if (!root) throw new Error(`root node ${rootId} not found`)
    return getBranch(root, $nodes, $relations, conf.maxDepth - 1)
  })

  return {
    ...dag,
    commands: {
      ...readonly(commandsStore),
      history: readonly(historyStore),
      copy: {
        linked: {
          add: (data: { id: string; parentId: string }) => {
            const command = { kind: 'add-linked-copy', ...data } as const
            commandsStore.add(command).exec()
          },
          remove: (data: { id: string; parentId: string }) => {
            const command = { kind: 'remove-linked-copy', ...data } as const
            commandsStore.add(command).exec()
          },
        },
      },
      delete: (data: { id: string }) => {
        const relations = get(relationsStore)
        const parentId = relations.find((r) => r.childId === data.id)?.parentId
        if (!parentId) return
        const nodes = get(nodesStore)
        const node = nodes.find((t) => t.id === data.id)
        if (!node) return
        const childrenIds = getChildren(data.id, nodes, relations).map((c) => c.id)
        const command = { kind: 'delete', node, parentId, childrenIds } as const
        commandsStore.add(command).exec()
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
        const command = { kind: 'insert', id: conf.createNodeId(data.name), ...data } as const
        commandsStore.add(command).exec()
      },
      undo: () => undo(historyStore, commandsStore, relationsStore, nodesStore),
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
    nodes: readonly(nodesStore),
  }
}

function exec(
  commandStore: Writable<Command[]>,
  nodesStore: Writable<Node[]>,
  relationsStore: Writable<Relation[]>,
  historyStore: Writable<Command[]>
) {
  const command = get(commandStore)[0]
  if (!command) return

  switch (command.kind) {
    case 'add-linked-copy':
      relationsStore.update(($relations) => [
        ...$relations,
        {
          id: createRelationId(),
          parentId: command.parentId,
          childId: command.id,
        },
      ])
      break

    case 'delete':
      {
        const { node, parentId, childrenIds } = command
        relationsStore.update(($relations) =>
          $relations.map((r) => {
            if (r.parentId !== node.id) return r
            if (!childrenIds.includes(r.childId)) return r
            return { ...r, parentId }
          })
        )
        relationsStore.update(($relations) => $relations.filter((r) => r.childId !== node.id))
        nodesStore.update(($nodes) => $nodes.filter((t) => t.id !== node.id))
      }
      break

    case 'remove-linked-copy':
      const { id, parentId } = command
      let foundOne = false

      relationsStore.update(($relations) =>
        $relations.filter((r) => {
          if (r.parentId !== parentId || r.childId !== id || foundOne) return true
          foundOne = true
          return false
        })
      )
      break

    case 'insert':
      nodesStore.update(($nodes) => [...$nodes, { id: command.id, name: command.name }])
      relationsStore.update(($relations) => [
        ...$relations,
        {
          id: createRelationId(),
          parentId: command.parentId,
          childId: command.id,
        },
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
      nodesStore.update(($nodes) =>
        $nodes.map((t) => (t.id === command.id ? { ...t, name: command.to } : t))
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
  nodesStore: Writable<Node[]>
) {
  const history = get(historyStore)
  if (!history.length) return
  const command = history[history.length - 1]
  historyStore.update(($history) => $history.slice(0, -1))
  commandsStore.add(command)

  switch (command.kind) {
    case 'delete':
      {
        const { node, parentId, childrenIds } = command
        nodesStore.update(($nodes) => [...$nodes, node])

        relationsStore.update(($relations) => {
          return $relations.map((r) => {
            if (!childrenIds.includes(r.childId)) return r
            return { ...r, parentId: node.id }
          })
        })
        relationsStore.update(($relations) => [
          ...$relations,
          { id: createRelationId(), parentId, childId: node.id },
        ])
      }
      break

    case 'add-linked-copy':
      const { id, parentId } = command
      let foundOne = false
      relationsStore.update(($relations) =>
        $relations.filter((r) => {
          if (r.parentId !== parentId || r.childId !== id || foundOne) return true
          foundOne = true
          return false
        })
      )
      break

    case 'remove-linked-copy':
      relationsStore.update(($relations) => [
        ...$relations,
        {
          id: createRelationId(),
          parentId: command.parentId,
          childId: command.id,
        },
      ])
      break

    case 'insert':
      nodesStore.update(($nodes) => $nodes.filter((t) => t.id !== command.id))
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
      nodesStore.update(($nodes) =>
        $nodes.map((t) => (t.id === command.id ? { ...t, name: command.from } : t))
      )
      break

    default:
      break
  }
}

function makeCommandsStore(
  nodesStore: Writable<Node[]>,
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
    exec: () => exec(store, nodesStore, relationsStore, historyStore),
  }
}

function getChildren(parentId: string, nodes: Node[], relations: Relation[]) {
  return relations
    .filter((r) => r.parentId === parentId)
    .map((r) => nodes.find((t) => t.id === r.childId))
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

function getBranchIds(nodeWithChildren: Branch | null): Node['id'][] {
  if (!nodeWithChildren) return []
  const { children, ...rest } = nodeWithChildren
  return [rest.id, ...children.flatMap(getBranchIds)].filter(onlyUnique)
}

function byName(a: Node, b: Node) {
  if (a.name > b.name) return 1
  if (a.name < b.name) return -1
  return 0
}
