import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, { message: "Slug wajib diisi" })
  .max(255, { message: "Slug maksimal 255 karakter" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug hanya boleh huruf kecil, angka, dan tanda strip (contoh: web-development)",
  });

const booleanQuerySchema = z.enum(["true", "false"]).transform((value) => value === "true");

const caseStudyBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Judul case study wajib diisi" })
    .max(255, { message: "Judul case study maksimal 255 karakter" }),
  slug: slugSchema,
  clientName: z
    .string()
    .trim()
    .min(1, { message: "Nama klien wajib diisi" })
    .max(255, { message: "Nama klien maksimal 255 karakter" }),
  industry: z
    .string()
    .trim()
    .min(1, { message: "Industri wajib diisi" })
    .max(100, { message: "Industri maksimal 100 karakter" }),
  serviceType: z
    .string()
    .trim()
    .min(1, { message: "Tipe layanan wajib diisi" })
    .max(255, { message: "Tipe layanan maksimal 255 karakter" }),
  summary: z
    .string()
    .trim()
    .min(1, { message: "Ringkasan wajib diisi" }),
  challenge: z
    .string()
    .trim()
    .min(1, { message: "Tantangan wajib diisi" }),
  solution: z
    .string()
    .trim()
    .min(1, { message: "Solusi wajib diisi" }),
  outcome: z
    .string()
    .trim()
    .min(1, { message: "Hasil wajib diisi" }),
  results: z.record(z.string(), z.unknown()).optional(),
  seoTitle: z
    .string()
    .trim()
    .min(1, { message: "SEO title wajib diisi" })
    .max(70, { message: "SEO title maksimal 70 karakter (rekomendasi Google: 50-60 karakter)" }),
  seoDescription: z
    .string()
    .trim()
    .min(1, { message: "SEO description wajib diisi" })
    .max(160, { message: "SEO description maksimal 160 karakter (rekomendasi Google: 150-160 karakter)" }),
  seoKeywords: z
    .array(z.string().trim().min(1, { message: "Keyword tidak boleh kosong" }).max(50, { message: "Setiap keyword maksimal 50 karakter" }))
    .max(10, { message: "Maksimal 10 keyword" }),
  canonicalUrl: z
    .string()
    .url({ message: "Canonical URL harus berupa URL yang valid" })
    .optional(),
  ogImageUrl: z
    .string()
    .url({ message: "OG Image URL harus berupa URL yang valid" })
    .optional(),
  featured: z.boolean().optional(),
});

export const caseStudyIdParamsSchema = {
  params: z.object({
    id: z.string().uuid({ message: "ID case study tidak valid" }),
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
    message: "Setidaknya satu field harus diisi",
  }),
};

export const updateCaseStudyWorkflowParamsSchema = {
  params: caseStudyIdParamsSchema.params,
};

export const scheduleCaseStudySchema = {
  params: caseStudyIdParamsSchema.params,
  body: z.object({
    publishedAt: z.coerce.date({ message: "Tanggal publikasi tidak valid" }),
  }),
};

export const publicCaseStudiesQuerySchema = {
  query: z.object({
    featured: booleanQuerySchema.optional(),
  }),
};
