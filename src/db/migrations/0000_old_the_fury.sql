CREATE TABLE IF NOT EXISTS "users" (
	"uuid" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "usersToWorkspaces" (
	"uuid" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"user_id" text NOT NULL,
	"workspace_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "workspaces" (
	"uuid" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"name" text NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "usersToWorkspaces" ADD CONSTRAINT "usersToWorkspaces_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "usersToWorkspaces" ADD CONSTRAINT "usersToWorkspaces_workspace_id_workspaces_uuid_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" ("username");
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "workspaces" ("name");