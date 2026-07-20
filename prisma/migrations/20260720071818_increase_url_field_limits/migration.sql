-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "user_agent" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "blog_posts" ALTER COLUMN "canonical_url" SET DATA TYPE TEXT,
ALTER COLUMN "og_image_url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "case_studies" ALTER COLUMN "canonical_url" SET DATA TYPE TEXT,
ALTER COLUMN "og_image_url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "source_page" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "media_assets" ALTER COLUMN "disk_path" SET DATA TYPE TEXT,
ALTER COLUMN "public_url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "navigation_items" ALTER COLUMN "url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pages" ALTER COLUMN "canonical_url" SET DATA TYPE TEXT,
ALTER COLUMN "og_image_url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "redirect_rules" ALTER COLUMN "source_path" SET DATA TYPE TEXT,
ALTER COLUMN "target_path" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "canonical_url" SET DATA TYPE TEXT,
ALTER COLUMN "og_image_url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "team_members" ALTER COLUMN "photo_url" SET DATA TYPE TEXT,
ALTER COLUMN "linkedin_url" SET DATA TYPE TEXT,
ALTER COLUMN "canonical_url" SET DATA TYPE TEXT,
ALTER COLUMN "og_image_url" SET DATA TYPE TEXT;
