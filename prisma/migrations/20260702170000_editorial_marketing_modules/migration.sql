-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM (
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED'
);

-- CreateTable
CREATE TABLE "blog_categories" (
  "id" UUID NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
  "id" UUID NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
  "id" UUID NOT NULL,
  "category_id" UUID,
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "excerpt" TEXT,
  "content" JSONB NOT NULL,
  "seo_title" VARCHAR(255),
  "seo_description" TEXT,
  "seo_keywords" JSONB,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
  "published_at" TIMESTAMP(3),
  "approved_at" TIMESTAMP(3),
  "submitted_for_review_at" TIMESTAMP(3),
  "archived_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_tags" (
  "id" UUID NOT NULL,
  "blog_post_id" UUID NOT NULL,
  "tag_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "blog_post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_studies" (
  "id" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "client_name" VARCHAR(255) NOT NULL,
  "industry" VARCHAR(100) NOT NULL,
  "service_type" VARCHAR(255) NOT NULL,
  "summary" TEXT NOT NULL,
  "challenge" TEXT NOT NULL,
  "solution" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "results" JSONB,
  "seo_title" VARCHAR(255),
  "seo_description" TEXT,
  "seo_keywords" JSONB,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
  "published_at" TIMESTAMP(3),
  "approved_at" TIMESTAMP(3),
  "submitted_for_review_at" TIMESTAMP(3),
  "archived_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
  "id" UUID NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "role" VARCHAR(255) NOT NULL,
  "company" VARCHAR(255) NOT NULL,
  "quote" TEXT NOT NULL,
  "rating" INTEGER,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
  "published_at" TIMESTAMP(3),
  "approved_at" TIMESTAMP(3),
  "submitted_for_review_at" TIMESTAMP(3),
  "archived_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
  "id" UUID NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "job_title" VARCHAR(255) NOT NULL,
  "bio" TEXT NOT NULL,
  "photo_url" VARCHAR(500),
  "linkedin_url" VARCHAR(500),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
  "published_at" TIMESTAMP(3),
  "approved_at" TIMESTAMP(3),
  "submitted_for_review_at" TIMESTAMP(3),
  "archived_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_categories" (
  "id" UUID NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "faq_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_items" (
  "id" UUID NOT NULL,
  "category_id" UUID,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
  "published_at" TIMESTAMP(3),
  "approved_at" TIMESTAMP(3),
  "submitted_for_review_at" TIMESTAMP(3),
  "archived_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");
CREATE INDEX "blog_categories_sort_order_idx" ON "blog_categories"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE INDEX "blog_posts_category_id_idx" ON "blog_posts"("category_id");
CREATE INDEX "blog_posts_status_published_at_idx" ON "blog_posts"("status", "published_at");
CREATE INDEX "blog_posts_featured_published_at_idx" ON "blog_posts"("featured", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_tags_blog_post_id_tag_id_key" ON "blog_post_tags"("blog_post_id", "tag_id");
CREATE INDEX "blog_post_tags_blog_post_id_idx" ON "blog_post_tags"("blog_post_id");
CREATE INDEX "blog_post_tags_tag_id_idx" ON "blog_post_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_slug_key" ON "case_studies"("slug");
CREATE INDEX "case_studies_status_published_at_idx" ON "case_studies"("status", "published_at");
CREATE INDEX "case_studies_featured_published_at_idx" ON "case_studies"("featured", "published_at");

-- CreateIndex
CREATE INDEX "testimonials_status_published_at_idx" ON "testimonials"("status", "published_at");
CREATE INDEX "testimonials_featured_sort_order_idx" ON "testimonials"("featured", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_slug_key" ON "team_members"("slug");
CREATE INDEX "team_members_status_published_at_idx" ON "team_members"("status", "published_at");
CREATE INDEX "team_members_featured_sort_order_idx" ON "team_members"("featured", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "faq_categories_slug_key" ON "faq_categories"("slug");
CREATE INDEX "faq_categories_sort_order_idx" ON "faq_categories"("sort_order");

-- CreateIndex
CREATE INDEX "faq_items_category_id_idx" ON "faq_items"("category_id");
CREATE INDEX "faq_items_status_published_at_idx" ON "faq_items"("status", "published_at");
CREATE INDEX "faq_items_featured_sort_order_idx" ON "faq_items"("featured", "sort_order");

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "faq_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
