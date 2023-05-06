import { isTruthy, onlyUnique } from '$lib/utils/array'
import { derived, get, writable } from 'svelte/store'

export type TreeStore = ReturnType<typeof makeTreeStore>
export type Relation = { id: string; parentId: string; childId: string }
export type Node = { id: string; name: string }
export type Branch = Node & { children: Branch[] }
export type Command = { kind: 'move'; id: string; from: string; to: string }

export function makeTreeStore(rootId: string, tags: Node[], relations: Relation[], maxDepth = 10) {
  const draggedStore = writable<Branch | null>(null)
  const historyStore = writable<Command[]>([])
  const relationsStore = writable<Relation[]>([])
  const tagsStore = writable<Node[]>([])

  const commandsStore = {
    ...writable<Command[]>([]),
    add(command: Command) {
      this.update(($commands) => [...$commands, command])
      return this
    },
    exec() {
      const command = get(this)[0]
      if (!command) return
      const { kind, id, from, to } = command
      this.update(($commands) => $commands.slice(1))
      relationsStore.update(($relations) => {
        return $relations.map((relation) => {
          if (relation.childId !== id || relation.parentId !== from) return relation
          return { ...relation, parentId: to }
        })
      })
      historyStore.update(($history) => [...$history, { kind, id, from, to }])
    },
  }

  tagsStore.set(tags)
  relationsStore.set(relations)

  const tree = derived([tagsStore, relationsStore], ([$tags, $relations]) => {
    const root = $tags.find((t) => t.id === rootId)
    if (!root) throw new Error(`root tag ${rootId} not found`)
    return getBranch(root, $tags, $relations, maxDepth - 1)
  })

  return {
    ...tree,
    maxDepth,
    relations: relationsStore,
    tags: tagsStore,
    dragged: {
      ...draggedStore,
      ids: derived(draggedStore, ($dragged) => getBranchIds($dragged)),
    },
    commands: {
      ...commandsStore,
      history: historyStore,
      undo: () => {
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
      redo: () => commandsStore.exec(),
      undos: derived(historyStore, ($history) => $history.length),
      redos: derived(commandsStore, ($commands) => $commands.length),
    },
  }
}

function getChildren(parentId: string, tags: Node[], relations: Relation[]) {
  return relations
    .filter((r) => r.parentId === parentId)
    .map((r) => tags.find((t) => t.id === r.childId))
    .filter(isTruthy)
}

export function getBranch(
  node: Node,
  nodes: Node[],
  relations: Relation[],
  maxDepth: number,
  depth = 0
): Branch {
  const children =
    depth > maxDepth
      ? []
      : getChildren(node.id, nodes, relations).map((child) =>
          getBranch(child, nodes, relations, maxDepth, depth + 1)
        )

  return { ...node, children }
}

export function getBranchIds(tagWithChildren: Branch | null): Node['id'][] {
  if (!tagWithChildren) return []
  const { children, ...rest } = tagWithChildren
  return [rest.id, ...children.flatMap(getBranchIds)].filter(onlyUnique)
}
