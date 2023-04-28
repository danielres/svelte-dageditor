import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at').defaultNow(),
  updateAt: timestamp('updated_at'),
}

const id = {
  id: text('uuid')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
}

const record = { ...id, ...timestamps }

export const users = pgTable(
  'users',
  {
    ...record,
    username: text('username').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
  },
  (users) => ({
    usernameIdx: uniqueIndex('username_idx').on(users.username),
    emailIdx: uniqueIndex('email_idx').on(users.email),
  })
)

export const workspaces = pgTable(
  'workspaces',
  {
    ...record,
    name: text('name').notNull(),
  },
  (workspaces) => ({
    nameIdx: uniqueIndex('name_idx').on(workspaces.name),
  })
)

export const usersToWorkspaces = pgTable('usersToWorkspaces', {
  ...record,
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
})

export const tags = pgTable(
  'tags',
  {
    ...record,
    name: text('name').notNull(),
    description: text('description'),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    createdBy: text('created_by').references(() => users.id, { onDelete: 'set null' }),
    updatedBy: text('updated_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (tags) => ({
    nameWorkspaceIdx: uniqueIndex('name_workspace_id_idx').on(tags.name, tags.workspaceId),
  })
)

export const tagsToTags = pgTable(
  'tagsToTags',
  {
    ...record,
    parentId: text('parent_id').references(() => tags.id, { onDelete: 'cascade' }),
    childId: text('child_id').references(() => tags.id, { onDelete: 'cascade' }),
  },
  (tagsToTags) => ({
    parentChildIdx: uniqueIndex('parent_id_idx').on(tagsToTags.parentId, tagsToTags.childId),
  })
)
