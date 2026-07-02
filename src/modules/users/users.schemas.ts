import { z } from "zod";

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const roleIdsSchema = z.array(z.number().int().positive()).min(1);

export const userIdParamsSchema = {
  params: idParamSchema,
};

export const createUserSchema = {
  body: z.object({
    email: z.email(),
    name: z.string().min(1).max(255).optional(),
    password: z.string().min(8),
    isActive: z.boolean().optional(),
    roleIds: roleIdsSchema.optional(),
  }),
};

export const updateUserSchema = {
  params: idParamSchema,
  body: z
    .object({
      email: z.email().optional(),
      name: z.string().min(1).max(255).optional(),
      password: z.string().min(8).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};

export const updateUserStatusSchema = {
  params: idParamSchema,
  body: z.object({
    isActive: z.boolean(),
  }),
};

export const assignUserRolesSchema = {
  params: idParamSchema,
  body: z.object({
    roleIds: roleIdsSchema,
  }),
};
