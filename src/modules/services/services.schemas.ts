import { z } from "zod";

const slugSchema = z.string().min(1).max(255);

export const serviceCategoryIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const serviceIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const serviceSlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const publicServicesQuerySchema = {
  query: z.object({
    categorySlug: z.string().min(1).optional(),
  }),
};

export const createServiceCategorySchema = {
  body: z.object({
    name: z.string().min(1).max(255),
    slug: slugSchema,
    description: z.string().min(1).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
};

export const updateServiceCategorySchema = {
  params: serviceCategoryIdParamsSchema.params,
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

export const createServiceSchema = {
  body: z.object({
    categoryId: z.string().uuid().optional(),
    name: z.string().min(1).max(255),
    slug: slugSchema,
    shortDescription: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    content: z.record(z.string(), z.unknown()).optional(),
    iconName: z.string().min(1).max(100).optional(),
    featured: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isPublished: z.boolean().optional(),
  }),
};

export const updateServiceSchema = {
  params: serviceIdParamsSchema.params,
  body: z
    .object({
      categoryId: z.string().uuid().nullable().optional(),
      name: z.string().min(1).max(255).optional(),
      slug: slugSchema.optional(),
      shortDescription: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      content: z.record(z.string(), z.unknown()).optional(),
      iconName: z.string().min(1).max(100).optional(),
      featured: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
      isPublished: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};
