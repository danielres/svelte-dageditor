import type { NestedTag, Relation, Tag } from '../types'

import { isTruthy } from '$lib/utils/array'
import { getChildren } from './getChildren'

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
