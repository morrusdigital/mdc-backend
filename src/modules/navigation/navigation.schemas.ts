import { z } from "zod";

export const navigationMenuIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const navigationCodeParamsSchema = {
  params: z.object({
    code: z.string().min(1),
  }),
};

export const updateNavigationMenuSchema = {
  params: navigationMenuIdParamsSchema.params,
  body: z
    .object({
      name: z.string().min(1).max(255).optional(),
      description: z.string().min(1).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};

const navigationItemSchema = z.object({
  id: z.string().uuid().optional(),
  parentId: z.string().uuid().nullable().optional(),
  pageId: z.string().uuid().nullable().optional(),
  label: z.string().min(1).max(255),
  url: z.string().min(1).max(500),
  target: z.string().min(1).max(50).optional(),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

export const replaceNavigationItemsSchema = {
  params: navigationMenuIdParamsSchema.params,
  body: z.object({
    items: z.array(navigationItemSchema),
  }),
};
