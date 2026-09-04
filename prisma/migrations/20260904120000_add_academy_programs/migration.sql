-- CreateTable
CREATE TABLE "academy_programs" (
  "id" UUID NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "short_title" VARCHAR(255) NOT NULL,
  "price_from" INTEGER NOT NULL,
  "duration" VARCHAR(100) NOT NULL,
  "format" VARCHAR(100) NOT NULL,
  "audience" TEXT NOT NULL,
  "image" VARCHAR(500) NOT NULL,
  "description" TEXT NOT NULL,
  "overview" TEXT NOT NULL,
  "highlights" JSONB NOT NULL,
  "tracks" JSONB NOT NULL,
  "seo_title" VARCHAR(255),
  "seo_description" TEXT,
  "seo_keywords" JSONB,
  "canonical_url" VARCHAR(500),
  "og_image_url" VARCHAR(500),
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "academy_programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academy_programs_slug_key" ON "academy_programs"("slug");

-- CreateIndex
CREATE INDEX "academy_programs_is_published_sort_order_idx" ON "academy_programs"("is_published", "sort_order");
