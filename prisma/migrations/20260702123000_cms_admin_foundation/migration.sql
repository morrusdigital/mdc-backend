ALTER TABLE "User" RENAME TO "users";

ALTER TABLE "users"
  RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "users"
  RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "users"
  ADD COLUMN "password_hash" VARCHAR(255),
  ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "last_login_at" TIMESTAMP(3);

CREATE TABLE "roles" (
  "id" SERIAL NOT NULL,
  "code" VARCHAR(100) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "is_system" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "permissions" (
  "id" SERIAL NOT NULL,
  "code" VARCHAR(100) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "module" VARCHAR(100) NOT NULL,
  "action" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_roles" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "role_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "role_permissions" (
  "id" SERIAL NOT NULL,
  "role_id" INTEGER NOT NULL,
  "permission_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "admin_sessions" (
  "id" UUID NOT NULL,
  "user_id" INTEGER NOT NULL,
  "refresh_token_hash" VARCHAR(255) NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),
  "last_used_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions"("role_id");
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");
CREATE INDEX "admin_sessions_user_id_idx" ON "admin_sessions"("user_id");
CREATE INDEX "admin_sessions_expires_at_idx" ON "admin_sessions"("expires_at");

ALTER TABLE "user_roles"
  ADD CONSTRAINT "user_roles_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_roles"
  ADD CONSTRAINT "user_roles_role_id_fkey"
  FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_permissions"
  ADD CONSTRAINT "role_permissions_role_id_fkey"
  FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_permissions"
  ADD CONSTRAINT "role_permissions_permission_id_fkey"
  FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "admin_sessions"
  ADD CONSTRAINT "admin_sessions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
