import { slugify } from './string'

export function createNodeId(nodeName: string) {
  return slugify(nodeName) + '-' + crypto.randomUUID().split('-').slice(0, 2).join('')
}

export function createRelationId() {
  return crypto.randomUUID()
}
