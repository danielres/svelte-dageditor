import { beforeEach, describe, it } from 'vitest'
import { User, UserToWorkspace, Workspace } from '../models'

beforeEach(async () => {
  await Promise.all([User.truncate(), Workspace.truncate()])
})

describe('usersToWorkspaces', () => {
  it('test...', async () => {
    const tom = await User.insert({ username: 'tom', email: 'tom@tom.com', password: '123' })
    const jane = await User.insert({ username: 'jane', email: 'jane@jane.com', password: '123' })

    const workspace1 = await Workspace.insert({ name: 'workspace1' })
    const workspace2 = await Workspace.insert({ name: 'workspace2' })
    const workspace3 = await Workspace.insert({ name: 'workspace3' })

    await UserToWorkspace.insert({ userId: tom.id, workspaceId: workspace1.id })
    await UserToWorkspace.insert({ userId: tom.id, workspaceId: workspace2.id })
    await UserToWorkspace.insert({ userId: jane.id, workspaceId: workspace1.id })

    const userWithWorkspaces = await User.findUserWithWorkspacesById(tom.id)
    console.log(JSON.stringify({ userWithWorkspaces }, null, 2))

    const workspaceWithUsers = await Workspace.findWorkspaceWithUsersById(workspace1.id)
    console.log(JSON.stringify({ workspaceWithUsers }, null, 2))

    const workspacesByUserId = await Workspace.findWorkspacesByUserId(tom.id)
    console.log(JSON.stringify({ workspacesByUserId }, null, 2))
  })
})
