import { z } from "zod";

const leadStatusSchema = z.enum(["new", "contacted", "qualified", "closed", "spam"]);
const idParams = z.object({
  id: z.string().uuid(),
});

const leadBaseSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  phone: z.string().min(1).max(100).optional(),
  company: z.string().min(1).max(255).optional(),
  message: z.string().min(1).optional(),
  source: z.string().min(1).max(255).optional(),
  sourcePage: z.string().min(1).max(500).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const publicLeadSubmitSchema = {
  body: leadBaseSchema.extend({
    website: z.string().optional(),
  }),
};

export const leadIdParamsSchema = {
  params: idParams,
};

export const listLeadsQuerySchema = {
  query: z.object({
    status: leadStatusSchema.optional(),
    assignedUserId: z.coerce.number().int().positive().optional(),
    search: z.string().min(1).optional(),
  }),
};

export const updateLeadSchema = {
  params: idParams,
  body: leadBaseSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};

export const updateLeadStatusSchema = {
  params: idParams,
  body: z.object({
    status: leadStatusSchema,
  }),
};

export const assignLeadSchema = {
  params: idParams,
  body: z.object({
    userId: z.number().int().positive(),
  }),
};

export const addLeadNoteSchema = {
  params: idParams,
  body: z.object({
    content: z.string().min(1),
  }),
};
