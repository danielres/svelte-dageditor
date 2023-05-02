export type NestedTag = Tag & { children: NestedTag[] }
export type Operation = { tag: string; from: string | null; to: string | null }
export type Relation = { parentId: string; childId: string }
export type Tag = { name: string; id: string }
