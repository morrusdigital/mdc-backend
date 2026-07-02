-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "client" VARCHAR(255) NOT NULL,
    "year" VARCHAR(10) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "industry" VARCHAR(100) NOT NULL,
    "service_type" VARCHAR(255) NOT NULL,
    "summary" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "deliverables" JSONB NOT NULL,
    "technologies" JSONB NOT NULL,
    "thumbnail_label" VARCHAR(10) NOT NULL,
    "thumbnail_tone" VARCHAR(20) NOT NULL,
    "gallery" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");
