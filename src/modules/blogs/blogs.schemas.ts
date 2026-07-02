import { z } from "zod";

const slugSchema = z.string().min(1).max(255);
const booleanQuerySchema = z.enum(["true", "false"]).transform((value) => value === "true");

const blogPostBaseSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(255),
  slug: slugSchema,
  excerpt: z.string().min(1).optional(),
  content: z.record(z.string(), z.unknown()),
  seoTitle: z.string().min(1).max(255).optional(),
  seoDescription: z.string().min(1).optional(),
  seoKeywords: z.array(z.string().min(1)).optional(),
  canonicalUrl: z.string().url().optional(),
  ogImageUrl: z.string().url().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  featured: z.boolean().optional(),
});

export const blogPostIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const blogPostSlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const blogCategoryIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const tagIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const createBlogPostSchema = {
  body: blogPostBaseSchema,
};

export const updateBlogPostSchema = {
  params: blogPostIdParamsSchema.params,
  body: blogPostBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  }),
};

export const updateWorkflowParamsSchema = {
  params: blogPostIdParamsSchema.params,
};

export const scheduleBlogPostSchema = {
  params: blogPostIdParamsSchema.params,
  body: z.object({
    publishedAt: z.coerce.date(),
  }),
};

const taxonomyBaseSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema,
  description: z.string().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const createBlogCategorySchema = {
  body: taxonomyBaseSchema,
};

export const updateBlogCategorySchema = {
  params: blogCategoryIdParamsSchema.params,
  body: taxonomyBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  }),
};

const tagBaseSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema,
});

export const createTagSchema = {
  body: tagBaseSchema,
};

export const updateTagSchema = {
  params: tagIdParamsSchema.params,
  body: tagBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  }),
};

export const publicBlogPostsQuerySchema = {
  query: z.object({
    categorySlug: z.string().min(1).optional(),
    tagSlug: z.string().min(1).optional(),
    featured: booleanQuerySchema.optional(),
  }),
};
