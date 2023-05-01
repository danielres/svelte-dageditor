import { Tag, TagToTag, Workspace, truncateAll } from '../db/models'

export async function resetData() {
  await truncateAll()
  const ws = await Workspace.insert({ name: 'ws1' })
  const root = await Tag.insert({ name: '<root>', workspaceId: ws.id, id: '<root>' })
  const t1 = await Tag.insert({ name: 't1', workspaceId: ws.id, id: 't1' })
  const t11 = await Tag.insert({ name: 't11', workspaceId: ws.id, id: 't11' })
  const t111 = await Tag.insert({ name: 't111', workspaceId: ws.id, id: 't111' })
  const t2 = await Tag.insert({ name: 't2', workspaceId: ws.id, id: 't2' })
  const tx = await Tag.insert({ name: 'tx', workspaceId: ws.id, id: 'tx' })
  const tx1 = await Tag.insert({ name: 'tx1', workspaceId: ws.id, id: 'tx1' })
  await TagToTag.insert({ parentId: t1.id, childId: t11.id })
  await TagToTag.insert({ parentId: root.id, childId: t1.id })
  await TagToTag.insert({ parentId: t11.id, childId: t111.id })
  await TagToTag.insert({ parentId: t1.id, childId: tx.id })
  await TagToTag.insert({ parentId: t2.id, childId: tx.id })
  await TagToTag.insert({ parentId: root.id, childId: t2.id })
  await TagToTag.insert({ parentId: tx.id, childId: tx1.id })
}