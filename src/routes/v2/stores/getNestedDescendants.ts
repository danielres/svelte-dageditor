import type { Tag, Relation } from '../stores'

import { isTruthy } from '$lib/utils/array'
import { getChildren } from './getChildren'

export type NestedTag = Tag & { children: NestedTag[] }

export function getNestedDescendants(
  allRelations: Relation[],
  allTags: Tag[],
  id: string
): NestedTag[] {
  return getChildren(allRelations, allTags, id)
    .filter(isTruthy)
    .map((child) => ({
      ...child,
      children: getNestedDescendants(allRelations, allTags, child.id),
    }))
}
