import { z } from "zod";

const galleryItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1),
});

const baseProjectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  client: z.string().min(1),
  year: z.string().min(1),
  category: z.string().min(1),
  industry: z.string().min(1),
  serviceType: z.string().min(1),
  summary: z.string().min(1),
  challenge: z.string().min(1),
  objective: z.string().min(1),
  solution: z.string().min(1),
  outcome: z.string().min(1),
  deliverables: z.array(z.string().min(1)),
  technologies: z.array(z.string().min(1)),
  thumbnailLabel: z.string().min(1),
  thumbnailTone: z.string().min(1),
  gallery: z.array(galleryItemSchema),
});

export const projectSlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const projectIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const createProjectSchema = {
  body: baseProjectSchema,
};

export const putProjectSchema = {
  params: projectIdParamsSchema.params,
  body: baseProjectSchema,
};

export const patchProjectSchema = {
  params: projectIdParamsSchema.params,
  body: baseProjectSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};
