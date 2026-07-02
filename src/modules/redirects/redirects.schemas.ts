import { z } from "zod";

const redirectBaseSchema = z.object({
  sourcePath: z.string().min(1).max(500),
  targetPath: z.string().min(1).max(500),
  statusCode: z.union([z.literal(301), z.literal(302)]),
  isActive: z.boolean().optional(),
  note: z.string().min(1).optional(),
});

export const redirectIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const createRedirectRuleSchema = {
  body: redirectBaseSchema,
};

export const updateRedirectRuleSchema = {
  params: redirectIdParamsSchema.params,
  body: redirectBaseSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};

export const resolveRedirectQuerySchema = {
  query: z.object({
    path: z.string().min(1).max(500),
  }),
};
