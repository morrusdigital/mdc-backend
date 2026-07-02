import { z } from "zod";

export const pageSectionTypes = [
  "hero",
  "rich_text",
  "image_text",
  "stats",
  "service_grid",
  "case_study_list",
  "testimonial_list",
  "faq_list",
  "cta_banner",
  "gallery",
  "contact_form",
] as const;

const pageSectionTypeSchema = z.enum(pageSectionTypes);

const sectionContentSchemas: Record<(typeof pageSectionTypes)[number], z.ZodTypeAny> = {
  hero: z.object({ headline: z.string().min(1) }).passthrough(),
  rich_text: z.object({ body: z.string().min(1) }).passthrough(),
  image_text: z.object({ title: z.string().min(1), body: z.string().min(1) }).passthrough(),
  stats: z.object({ items: z.array(z.object({ label: z.string().min(1), value: z.union([z.string(), z.number()]) })).min(1) }).passthrough(),
  service_grid: z.object({ title: z.string().optional() }).passthrough(),
  case_study_list: z.object({ title: z.string().optional() }).passthrough(),
  testimonial_list: z.object({ title: z.string().optional() }).passthrough(),
  faq_list: z.object({ items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1) }).passthrough(),
  cta_banner: z.object({ headline: z.string().min(1), ctaLabel: z.string().min(1) }).passthrough(),
  gallery: z.object({ items: z.array(z.object({ src: z.string().min(1), alt: z.string().min(1), caption: z.string().optional() })).min(1) }).passthrough(),
  contact_form: z.object({ title: z.string().optional() }).passthrough(),
};

const pageSectionInputSchema = z
  .object({
    type: pageSectionTypeSchema,
    label: z.string().min(1).max(255).optional(),
    sortOrder: z.number().int().min(0),
    isEnabled: z.boolean().optional(),
    content: z.record(z.string(), z.unknown()),
  })
  .superRefine((value, ctx) => {
    const parser = sectionContentSchemas[value.type];
    const parsed = parser.safeParse(value.content);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({
          code: "custom",
          path: ["content", ...issue.path],
          message: issue.message,
        });
      }
    }
  });

const pageBaseSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  excerpt: z.string().min(1).optional(),
  seoTitle: z.string().min(1).max(255).optional(),
  seoDescription: z.string().min(1).optional(),
  seoKeywords: z.array(z.string().min(1)).optional(),
  canonicalUrl: z.string().url().optional(),
  ogImageUrl: z.string().url().optional(),
});

export const pageIdParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const pageSlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const createPageSchema = {
  body: pageBaseSchema.extend({
    sections: z.array(pageSectionInputSchema).optional(),
  }),
};

export const updatePageSchema = {
  params: pageIdParamsSchema.params,
  body: pageBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  }),
};

export const replacePageSectionsSchema = {
  params: pageIdParamsSchema.params,
  body: z.object({
    sections: z.array(pageSectionInputSchema),
  }),
};

export const publishPageSchema = {
  params: pageIdParamsSchema.params,
  body: z.object({
    isPublished: z.boolean(),
  }),
};
