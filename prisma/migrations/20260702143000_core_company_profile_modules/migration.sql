CREATE TABLE "pages" (
  "id" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "excerpt" TEXT,
  "seo_title" VARCHAR(255),
  "seo_description" TEXT,
  "seo_keywords" JSONB,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "page_sections" (
  "id" UUID NOT NULL,
  "page_id" UUID NOT NULL,
  "type" VARCHAR(100) NOT NULL,
  "label" VARCHAR(255),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_enabled" BOOLEAN NOT NULL DEFAULT true,
  "content" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "service_categories" (
  "id" UUID NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "services" (
  "id" UUID NOT NULL,
  "category_id" UUID,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "short_description" TEXT,
  "description" TEXT,
  "content" JSONB,
  "icon_name" VARCHAR(100),
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "navigation_menus" (
  "id" UUID NOT NULL,
  "code" VARCHAR(100) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "navigation_menus_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "navigation_items" (
  "id" UUID NOT NULL,
  "menu_id" UUID NOT NULL,
  "parent_id" UUID,
  "page_id" UUID,
  "label" VARCHAR(255) NOT NULL,
  "url" VARCHAR(500) NOT NULL,
  "target" VARCHAR(50),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_settings" (
  "id" UUID NOT NULL,
  "group" VARCHAR(100) NOT NULL,
  "key" VARCHAR(100) NOT NULL,
  "label" VARCHAR(255),
  "value" JSONB NOT NULL,
  "value_type" VARCHAR(50) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");
CREATE UNIQUE INDEX "service_categories_slug_key" ON "service_categories"("slug");
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
CREATE UNIQUE INDEX "navigation_menus_code_key" ON "navigation_menus"("code");
CREATE UNIQUE INDEX "site_settings_group_key_key" ON "site_settings"("group", "key");

CREATE INDEX "page_sections_page_id_idx" ON "page_sections"("page_id");
CREATE INDEX "page_sections_page_id_sort_order_idx" ON "page_sections"("page_id", "sort_order");
CREATE INDEX "services_category_id_idx" ON "services"("category_id");
CREATE INDEX "services_is_published_sort_order_idx" ON "services"("is_published", "sort_order");
CREATE INDEX "navigation_items_menu_id_idx" ON "navigation_items"("menu_id");
CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items"("parent_id");
CREATE INDEX "navigation_items_page_id_idx" ON "navigation_items"("page_id");
CREATE INDEX "navigation_items_menu_id_sort_order_idx" ON "navigation_items"("menu_id", "sort_order");
CREATE INDEX "site_settings_group_idx" ON "site_settings"("group");

ALTER TABLE "page_sections"
  ADD CONSTRAINT "page_sections_page_id_fkey"
  FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "services"
  ADD CONSTRAINT "services_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "navigation_items"
  ADD CONSTRAINT "navigation_items_menu_id_fkey"
  FOREIGN KEY ("menu_id") REFERENCES "navigation_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "navigation_items"
  ADD CONSTRAINT "navigation_items_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "navigation_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "navigation_items"
  ADD CONSTRAINT "navigation_items_page_id_fkey"
  FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
