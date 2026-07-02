import { z } from "zod";

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const permissionIdsSchema = z.array(z.number().int().positive());

export const roleIdParamsSchema = {
  params: idParamSchema,
};

export const createRoleSchema = {
  body: z.object({
    code: z.string().min(3).max(100).regex(/^[a-z0-9_]+$/),
    name: z.string().min(1).max(255),
    description: z.string().min(1).optional(),
    permissionIds: permissionIdsSchema.optional(),
  }),
};

export const updateRoleSchema = {
  params: idParamSchema,
  body: z
    .object({
      code: z.string().min(3).max(100).regex(/^[a-z0-9_]+$/).optional(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().min(1).nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};

export const assignRolePermissionsSchema = {
  params: idParamSchema,
  body: z.object({
    permissionIds: permissionIdsSchema,
  }),
};
