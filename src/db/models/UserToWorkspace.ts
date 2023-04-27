import db from '../db'
import { usersToWorkspaces } from '../schema'

export async function insert(values: { userId: string; workspaceId: string; id?: string }) {
  const [result] = await db.insert(usersToWorkspaces).values(values).returning()
  return result
}
