import { describe, expect, it } from 'vitest'
import { User, UserToWorkspace, Workspace } from '../models'

describe('UserToWorkspace', () => {
  it('test...', async () => {
    const tom = await User.insert({ username: 'tom', email: 'tom@tom.com', password: '123' })
    const jane = await User.insert({ username: 'jane', email: 'jane@jane.com', password: '123' })

    const workspace1 = await Workspace.insert({ name: 'workspace1' })
    const workspace2 = await Workspace.insert({ name: 'workspace2' })
    await Workspace.insert({ name: 'workspace3' })

    const tom_w1 = await UserToWorkspace.insert({ userId: tom.id, workspaceId: workspace1.id })
    const tom_w2 = await UserToWorkspace.insert({ userId: tom.id, workspaceId: workspace2.id })
    const jane_w1 = await UserToWorkspace.insert({ userId: jane.id, workspaceId: workspace1.id })

    const userWithWorkspaces = await User.findUserWithWorkspacesById(tom.id)
    expect(userWithWorkspaces).toEqual({
      ...tom,
      workspaces: [
        { ...workspace1, meta: { joinedAt: tom_w1.createdAt } },
        { ...workspace2, meta: { joinedAt: tom_w2.createdAt } },
      ],
    })

    const workspaceWithUsers = await Workspace.findWorkspaceWithUsersById(workspace1.id)
    expect(workspaceWithUsers).toEqual({
      id: workspaceWithUsers.id,
      createdAt: workspaceWithUsers.createdAt,
      updateAt: null,
      name: 'workspace1',
      users: [
        { ...tom, meta: { joinedAt: tom_w1.createdAt } },
        { ...jane, meta: { joinedAt: jane_w1.createdAt } },
      ],
    })

    const workspacesByUserId = await Workspace.findWorkspacesByUserId(tom.id)
    expect(workspacesByUserId).toEqual([
      { ...workspace1, meta: { joinedAt: tom_w1.createdAt } },
      { ...workspace2, meta: { joinedAt: tom_w2.createdAt } },
    ])
  })
})
