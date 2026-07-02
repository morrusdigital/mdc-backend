import { z } from "zod";

const slugSchema = z.string().min(1).max(255);
const booleanQuerySchema = z.enum(["true", "false"]).transform((value) => value === "true");

export const faqCategoryIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const faqItemIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const createFaqCategorySchema = {
  body: z.object({
    name: z.string().min(1).max(255),
    slug: slugSchema,
    description: z.string().min(1).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
};

export const updateFaqCategorySchema = {
  params: faqCategoryIdParamsSchema.params,
  body: z
    .object({
      name: z.string().min(1).max(255).optional(),
      slug: slugSchema.optional(),
      description: z.string().min(1).optional(),
      sortOrder: z.number().int().min(0).optional(),
      isActive: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};

export const createFaqItemSchema = {
  body: z.object({
    categoryId: z.string().uuid().nullable().optional(),
    question: z.string().min(1),
    answer: z.string().min(1),
    sortOrder: z.number().int().min(0).optional(),
    featured: z.boolean().optional(),
  }),
};

export const updateFaqItemSchema = {
  params: faqItemIdParamsSchema.params,
  body: z
    .object({
      categoryId: z.string().uuid().nullable().optional(),
      question: z.string().min(1).optional(),
      answer: z.string().min(1).optional(),
      sortOrder: z.number().int().min(0).optional(),
      featured: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};

export const updateFaqWorkflowParamsSchema = {
  params: faqItemIdParamsSchema.params,
};

export const scheduleFaqItemSchema = {
  params: faqItemIdParamsSchema.params,
  body: z.object({
    publishedAt: z.coerce.date(),
  }),
};

export const publicFaqsQuerySchema = {
  query: z.object({
    categorySlug: z.string().min(1).optional(),
    featured: booleanQuerySchema.optional(),
  }),
};
