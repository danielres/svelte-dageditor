import { beforeEach, describe, expect, it } from 'vitest'
import { Tag, TagToTag, Workspace, truncateAll } from '../models'

describe('Tag', () => {
  describe('insert(), findByName()', () => {
    it('inserts a tag, finds it by name, prevents duplicates', async () => {
      const name = 't1'
      const ws1 = await Workspace.insert({ name: 'ws1' })
      await Tag.insert({ name, workspaceId: ws1.id })

      const actual = await Tag.findByName(name)
      expect(actual.name).toEqual(name)

      await expect(
        Tag.insert({ name, workspaceId: ws1.id })
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        '"duplicate key value violates unique constraint \\"name_workspace_id_idx\\""'
      )
    })
  })

  describe('findAllByWorkspaceId()', () => {
    it('finds all tags under a same workspace', async () => {
      const ws1 = await Workspace.insert({ name: 'ws1' })
      const ws2 = await Workspace.insert({ name: 'ws2' })

      const t1 = await Tag.insert({ name: 't1', workspaceId: ws1.id })
      const t11 = await Tag.insert({ name: 't11', workspaceId: ws1.id })
      const t12 = await Tag.insert({ name: 't12', workspaceId: ws1.id })
      const t121 = await Tag.insert({ name: 't121', workspaceId: ws1.id })
      const t2 = await Tag.insert({ name: 't2', workspaceId: ws1.id })
      const tx = await Tag.insert({ name: 'tx', workspaceId: ws1.id })

      await Tag.insert({ name: 't3', workspaceId: ws2.id })

      await TagToTag.insert({ parentId: t1.id, childId: t11.id })
      await TagToTag.insert({ parentId: t1.id, childId: t12.id })
      await TagToTag.insert({ parentId: t12.id, childId: t121.id })
      await TagToTag.insert({ parentId: t1.id, childId: tx.id })
      await TagToTag.insert({ parentId: t2.id, childId: tx.id })

      const actual = await Tag.findAllByWorkspaceId(ws1.id)

      expect(actual.map((t) => t.name).sort()).toEqual(
        ['t1', 't11', 't12', 't121', 't2', 'tx', 'tx'].sort()
      )
    })
  })
})
