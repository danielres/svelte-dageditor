import { sql } from 'drizzle-orm'
import * as d from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: d.timestamp('created_at').defaultNow(),
  updateAt: d.timestamp('updated_at'),
}

const id = {
  id: d
    .text('uuid')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
}

const record = {
  ...id,
  ...timestamps,
}

export const users = d.pgTable(
  'users',
  {
    ...record,
    username: d.text('username').notNull(),
    email: d.text('email').notNull(),
    password: d.text('password').notNull(),
  },
  (users) => {
    return {
      usernameIdx: d.uniqueIndex('username_idx').on(users.username),
      emailIdx: d.uniqueIndex('email_idx').on(users.email),
    }
  }
)

export const workspaces = d.pgTable(
  'workspaces',
  {
    ...record,
    name: d.text('name').notNull(),
  },
  (workspaces) => {
    return {
      nameIdx: d.uniqueIndex('name_idx').on(workspaces.name),
    }
  }
)

export const usersToWorkspaces = d.pgTable('usersToWorkspaces', {
  ...record,
  userId: d
    .text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: d
    .text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
})
