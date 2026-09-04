-- CreateTable
CREATE TABLE "academy_events" (
  "id" UUID NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "category" VARCHAR(255) NOT NULL,
  "summary" TEXT NOT NULL,
  "start_date" TIMESTAMP(3) NOT NULL,
  "end_date" TIMESTAMP(3) NOT NULL,
  "date_label" VARCHAR(255) NOT NULL,
  "time_label" VARCHAR(255) NOT NULL,
  "location" VARCHAR(255) NOT NULL,
  "price" INTEGER NOT NULL DEFAULT 0,
  "price_label" VARCHAR(255) NOT NULL,
  "seat_label" VARCHAR(255) NOT NULL,
  "image" VARCHAR(500) NOT NULL,
  "learnings" JSONB NOT NULL,
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

  CONSTRAINT "academy_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academy_events_slug_key" ON "academy_events"("slug");

-- CreateIndex
CREATE INDEX "academy_events_is_published_sort_order_idx" ON "academy_events"("is_published", "sort_order");
