import { describe, expect, it } from 'vitest'
import { Tag, TagToTag, Workspace, truncateAll } from '../models'

describe('TagToTag', () => {
  describe('insert()', async () => {
    it('inserts a tag parent-child relation, prevents duplicates', async () => {
      const ws1 = await Workspace.insert({ name: 'ws1' })
      const t1 = await Tag.insert({ name: 't1', workspaceId: ws1.id })
      const t2 = await Tag.insert({ name: 't2', workspaceId: ws1.id })
      const values = { parentId: t1.id, childId: t2.id }

      const actual = await TagToTag.insert(values)

      expect(actual.parentId).toEqual(t1.id)
      expect(actual.childId).toEqual(t2.id)

      await expect(TagToTag.insert(values)).rejects.toThrowErrorMatchingInlineSnapshot(
        '"duplicate key value violates unique constraint \\"parent_id_idx\\""'
      )
    })
  })
})
