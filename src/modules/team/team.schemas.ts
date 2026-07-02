import { z } from "zod";

const slugSchema = z.string().min(1).max(255);
const booleanQuerySchema = z.enum(["true", "false"]).transform((value) => value === "true");

const teamMemberBaseSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema,
  jobTitle: z.string().min(1).max(255),
  bio: z.string().min(1),
  photoUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  sortOrder: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
});

export const teamMemberIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const teamMemberSlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const createTeamMemberSchema = {
  body: teamMemberBaseSchema,
};

export const updateTeamMemberSchema = {
  params: teamMemberIdParamsSchema.params,
  body: teamMemberBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  }),
};

export const updateTeamWorkflowParamsSchema = {
  params: teamMemberIdParamsSchema.params,
};

export const scheduleTeamMemberSchema = {
  params: teamMemberIdParamsSchema.params,
  body: z.object({
    publishedAt: z.coerce.date(),
  }),
};

export const publicTeamMembersQuerySchema = {
  query: z.object({
    featured: booleanQuerySchema.optional(),
  }),
};
