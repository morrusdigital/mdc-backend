import { z } from "zod";

const booleanQuerySchema = z.enum(["true", "false"]).transform((value) => value === "true");

const testimonialBaseSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  company: z.string().min(1).max(255),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  sortOrder: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
});

export const testimonialIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const createTestimonialSchema = {
  body: testimonialBaseSchema,
};

export const updateTestimonialSchema = {
  params: testimonialIdParamsSchema.params,
  body: testimonialBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  }),
};

export const updateTestimonialWorkflowParamsSchema = {
  params: testimonialIdParamsSchema.params,
};

export const scheduleTestimonialSchema = {
  params: testimonialIdParamsSchema.params,
  body: z.object({
    publishedAt: z.coerce.date(),
  }),
};

export const publicTestimonialsQuerySchema = {
  query: z.object({
    featured: booleanQuerySchema.optional(),
  }),
};
