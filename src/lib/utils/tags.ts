import { isTruthy, onlyUnique } from './array'

export type Tag = { id: string; parentId: string | null; name: string }

export function getParents(tags: Tag[], tagId: string) {
  const tagInstances = tags.filter((tag) => tagId.includes(tag.id))
  const parentIds = tagInstances.map((t) => t.parentId).filter(isTruthy)
  return tags.filter((tag) => parentIds.includes(tag.id))
}

export function getAncestors(tags: Tag[], tagId: string): Tag[] {
  const parents = getParents(tags, tagId)
  const ancestors = parents.flatMap((parent) => getAncestors(tags, parent.id))
  return [...parents, ...ancestors].filter(onlyUnique)
}

export function getChildren(tags: Tag[], tagId: string) {
  return tags.filter((tag) => tag.parentId === tagId)
}

export function getDescendants(tags: Tag[], tagId: string): Tag[] {
  const children = getChildren(tags, tagId)
  const descendants = children.flatMap((child) => getDescendants(tags, child.id))
  return [...children, ...descendants].filter(onlyUnique)
}

export function getSiblings(tags: Tag[], tagId: string) {
  const tag = tags.find((tag) => tag.id === tagId)
  if (!tag) return []
  return tags.filter((t) => t.parentId === tag.parentId && t.id !== tagId)
}

// export function getAllowedChildren(tags: Tag[], tag: Tag): Tag[] {
//   const allowedChildren: Tag[] = []
//   const ancestors = getAncestors(tags, tag.id)
//   const ancestorIds = new Set(ancestors.map((ancestor) => ancestor.id))

//   for (const potentialChild of tags) {
//     // Exclude the tag itself, its ancestors, and its current children
//     if (
//       potentialChild.id !== tag.id &&
//       !ancestorIds.has(potentialChild.id) &&
//       potentialChild.parentId !== tag.id
//     ) {
//       allowedChildren.push(potentialChild)
//     }
//   }

//   return allowedChildren
// }
