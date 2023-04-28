CREATE TABLE IF NOT EXISTS "tags" (
	"uuid" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"name" text NOT NULL,
	"description" text,
	"workspace_id" text,
	"created_by" text,
	"updated_by" text
);

CREATE TABLE IF NOT EXISTS "tagsToTags" (
	"uuid" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"parent_id" text,
	"child_id" text
);

DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_workspace_id_workspaces_uuid_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("uuid") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_created_by_users_uuid_fk" FOREIGN KEY ("created_by") REFERENCES "users"("uuid") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_updated_by_users_uuid_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("uuid") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tagsToTags" ADD CONSTRAINT "tagsToTags_parent_id_tags_uuid_fk" FOREIGN KEY ("parent_id") REFERENCES "tags"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tagsToTags" ADD CONSTRAINT "tagsToTags_child_id_tags_uuid_fk" FOREIGN KEY ("child_id") REFERENCES "tags"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "tags" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "parent_id_idx" ON "tagsToTags" ("parent_id","child_id");