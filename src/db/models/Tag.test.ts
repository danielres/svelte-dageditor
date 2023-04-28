import { beforeEach, describe, expect, it } from 'vitest'
import { Tag, Workspace, truncateAll } from '../models'

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

      await Tag.insert({ name: 't1', workspaceId: ws1.id })
      await Tag.insert({ name: 't2', workspaceId: ws1.id })
      await Tag.insert({ name: 't3', workspaceId: ws2.id })

      const actual = await Tag.findAllByWorkspaceId(ws1.id)
      expect(actual.map((t) => t.name)).toEqual(['t1', 't2'])
    })
  })
})
