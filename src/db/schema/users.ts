import * as d from 'drizzle-orm/pg-core'

export const users = d.pgTable(
  'users',
  {
    id: d.text('uuid').primaryKey(),
    username: d.text('username').notNull(),
    email: d.text('email').notNull(),
    password: d.text('password').notNull(),
    createdAt: d.timestamp('created_at').defaultNow(),
    updateAt: d.timestamp('updated_at'),
  },
  (users) => {
    return {
      usernameIdx: d.uniqueIndex('username_idx').on(users.username),
      emailIdx: d.uniqueIndex('email_idx').on(users.email),
    }
  }
)
