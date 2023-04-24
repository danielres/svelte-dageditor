CREATE TABLE IF NOT EXISTS "users" (
	"uuid" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" ("username");
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");