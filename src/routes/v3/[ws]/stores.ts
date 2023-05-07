import { isTruthy, onlyUnique } from '$lib/utils/array'
import { derived, get, writable } from 'svelte/store'

export type TreeStore = ReturnType<typeof makeTreeStore>

export type Relation = { id: string; parentId: string; childId: string }
export type Node = { id: string; name: string }
export type Branch = Node & { children: Branch[] }
type CommandMove = { kind: 'move'; id: string; from: string; to: string }
type CommandRename = { kind: 'rename'; id: string; from: string; to: string }
type CommandInsert = { kind: 'insert'; id: string; name: string; parentId: string }
export type Command = CommandMove | CommandRename | CommandInsert

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

      switch (command.kind) {
        case 'insert':
          tagsStore.update(($tags) => [...$tags, { id: command.id, name: command.name }])
          relationsStore.update(($relations) => [
            ...$relations,
            { id: crypto.randomUUID(), parentId: command.parentId, childId: command.id },
          ])
          break

        case 'move':
          relationsStore.update(($relations) => {
            return $relations.map((relation) => {
              if (relation.childId !== command.id || relation.parentId !== command.from)
                return relation
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

      this.update(($commands) => $commands.slice(1))
      historyStore.update(($history) => [...$history, command])
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
      set(branch: Branch) {
        draggedStore.set(branch)
      },
      clear() {
        draggedStore.set(null)
      },
    },
    commands: {
      ...commandsStore,
      history: historyStore,
      move(data: { id: string; from: string; to: string }) {
        commandsStore.add({ kind: 'move', ...data })
        commandsStore.exec()
      },
      rename(data: { id: string; from: string; to: string }) {
        commandsStore.add({ kind: 'rename', ...data })
        commandsStore.exec()
      },
      insert(data: { name: string; parentId: string }) {
        commandsStore.add({ kind: 'insert', id: crypto.randomUUID(), ...data })
        commandsStore.exec()
      },
      undo: () => {
        const history = get(historyStore)
        if (!history.length) return
        const command = history[history.length - 1]
        historyStore.update(($history) => $history.slice(0, -1))
        commandsStore.add(command)
        switch (command.kind) {
          case 'move':
            relationsStore.update(($relations) => {
              return $relations.map((relation) => {
                if (relation.childId !== command.id || relation.parentId !== command.to)
                  return relation
                return { ...relation, parentId: command.from }
              })
            })
            break

          case 'rename':
            tagsStore.update(($tags) =>
              $tags.map((t) => (t.id === command.id ? { ...t, name: command.from } : t))
            )
            break

          case 'insert':
            tagsStore.update(($tags) => $tags.filter((t) => t.id !== command.id))
            relationsStore.update(($relations) =>
              $relations.filter((r) => r.childId !== command.id)
            )
            break

          default:
            break
        }
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
