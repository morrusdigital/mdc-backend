import { z } from "zod";

const slugSchema = z.string().min(1).max(255);
const booleanQuerySchema = z.enum(["true", "false"]).transform((value) => value === "true");

const caseStudyBaseSchema = z.object({
  title: z.string().min(1).max(255),
  slug: slugSchema,
  clientName: z.string().min(1).max(255),
  industry: z.string().min(1).max(100),
  serviceType: z.string().min(1).max(255),
  summary: z.string().min(1),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  outcome: z.string().min(1),
  results: z.record(z.string(), z.unknown()).optional(),
  seoTitle: z.string().min(1).max(255).optional(),
  seoDescription: z.string().min(1).optional(),
  seoKeywords: z.array(z.string().min(1)).optional(),
  featured: z.boolean().optional(),
});

export const caseStudyIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const caseStudySlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const createCaseStudySchema = {
  body: caseStudyBaseSchema,
};

export const updateCaseStudySchema = {
  params: caseStudyIdParamsSchema.params,
  body: caseStudyBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  }),
};

export const updateCaseStudyWorkflowParamsSchema = {
  params: caseStudyIdParamsSchema.params,
};

export const scheduleCaseStudySchema = {
  params: caseStudyIdParamsSchema.params,
  body: z.object({
    publishedAt: z.coerce.date(),
  }),
};

export const publicCaseStudiesQuerySchema = {
  query: z.object({
    featured: booleanQuerySchema.optional(),
  }),
};
