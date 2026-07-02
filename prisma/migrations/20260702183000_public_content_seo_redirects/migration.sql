-- AlterTable
ALTER TABLE "pages"
ADD COLUMN "canonical_url" VARCHAR(500),
ADD COLUMN "og_image_url" VARCHAR(500);

-- AlterTable
ALTER TABLE "services"
ADD COLUMN "seo_title" VARCHAR(255),
ADD COLUMN "seo_description" TEXT,
ADD COLUMN "seo_keywords" JSONB,
ADD COLUMN "canonical_url" VARCHAR(500),
ADD COLUMN "og_image_url" VARCHAR(500);

-- AlterTable
ALTER TABLE "blog_posts"
ADD COLUMN "canonical_url" VARCHAR(500),
ADD COLUMN "og_image_url" VARCHAR(500);

-- AlterTable
ALTER TABLE "case_studies"
ADD COLUMN "canonical_url" VARCHAR(500),
ADD COLUMN "og_image_url" VARCHAR(500);

-- AlterTable
ALTER TABLE "team_members"
ADD COLUMN "seo_title" VARCHAR(255),
ADD COLUMN "seo_description" TEXT,
ADD COLUMN "seo_keywords" JSONB,
ADD COLUMN "canonical_url" VARCHAR(500),
ADD COLUMN "og_image_url" VARCHAR(500);

-- CreateTable
CREATE TABLE "redirect_rules" (
  "id" UUID NOT NULL,
  "source_path" VARCHAR(500) NOT NULL,
  "target_path" VARCHAR(500) NOT NULL,
  "status_code" INTEGER NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "note" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "redirect_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "redirect_rules_source_path_key" ON "redirect_rules"("source_path");
CREATE INDEX "redirect_rules_is_active_idx" ON "redirect_rules"("is_active");
