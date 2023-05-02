import type { Relation, Tag } from '../types'

export function getChildren(allRelations: Relation[], allTags: Tag[], id: string) {
  return allRelations
    .filter((r) => r.parentId === id)
    .map((r) => r.childId)
    .map((id) => allTags.find((t) => t.id === id))
}
