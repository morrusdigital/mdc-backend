import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, { message: "Slug wajib diisi" })
  .max(255, { message: "Slug maksimal 255 karakter" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug hanya boleh huruf kecil, angka, dan tanda strip (contoh: web-development)",
  });

export const serviceCategoryIdParamsSchema = {
  params: z.object({
    id: z.string().uuid({ message: "ID kategori tidak valid" }),
  }),
};

export const serviceIdParamsSchema = {
  params: z.object({
    id: z.string().uuid({ message: "ID layanan tidak valid" }),
  }),
};

export const serviceSlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const publicServicesQuerySchema = {
  query: z.object({
    categorySlug: z.string().min(1).optional(),
    featured: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  }),
};

export const createServiceCategorySchema = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Nama kategori wajib diisi" })
      .max(255, { message: "Nama kategori maksimal 255 karakter" }),
    slug: slugSchema,
    description: z
      .string()
      .trim()
      .min(1, { message: "Deskripsi tidak boleh kosong" })
      .optional(),
    sortOrder: z
      .number()
      .int({ message: "Urutan harus berupa angka bulat" })
      .min(0, { message: "Urutan tidak boleh negatif" })
      .optional(),
    isActive: z.boolean().optional(),
  }),
};

export const updateServiceCategorySchema = {
  params: serviceCategoryIdParamsSchema.params,
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, { message: "Nama kategori wajib diisi" })
        .max(255, { message: "Nama kategori maksimal 255 karakter" })
        .optional(),
      slug: slugSchema.optional(),
      description: z
        .string()
        .trim()
        .min(1, { message: "Deskripsi tidak boleh kosong" })
        .optional(),
      sortOrder: z
        .number()
        .int({ message: "Urutan harus berupa angka bulat" })
        .min(0, { message: "Urutan tidak boleh negatif" })
        .optional(),
      isActive: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "Setidaknya satu field harus diisi",
    }),
};

export const createServiceSchema = {
  body: z.object({
    categoryId: z
      .string()
      .uuid({ message: "Kategori tidak valid" })
      .optional(),
    name: z
      .string()
      .trim()
      .min(1, { message: "Nama layanan wajib diisi" })
      .max(255, { message: "Nama layanan maksimal 255 karakter" }),
    slug: slugSchema,
    shortDescription: z
      .string()
      .trim()
      .min(1, { message: "Deskripsi singkat tidak boleh kosong" })
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, { message: "Deskripsi tidak boleh kosong" })
      .optional(),
    content: z.record(z.string(), z.unknown()).optional(),
    seoTitle: z
      .string()
      .trim()
      .min(1, { message: "SEO title tidak boleh kosong" })
      .max(255, { message: "SEO title maksimal 255 karakter" })
      .optional(),
    seoDescription: z
      .string()
      .trim()
      .min(1, { message: "SEO description tidak boleh kosong" })
      .optional(),
    seoKeywords: z
      .array(z.string().trim().min(1, { message: "Keyword tidak boleh kosong" }))
      .optional(),
    canonicalUrl: z
      .string()
      .url({ message: "Canonical URL harus berupa URL yang valid" })
      .optional(),
    ogImageUrl: z
      .string()
      .url({ message: "OG Image URL harus berupa URL yang valid" })
      .optional(),
    iconName: z
      .string()
      .trim()
      .min(1, { message: "Nama ikon tidak boleh kosong" })
      .max(100, { message: "Nama ikon maksimal 100 karakter" })
      .optional(),
    featured: z.boolean().optional(),
    sortOrder: z
      .number()
      .int({ message: "Urutan harus berupa angka bulat" })
      .min(0, { message: "Urutan tidak boleh negatif" })
      .optional(),
    isPublished: z.boolean().optional(),
  }),
};

export const updateServiceSchema = {
  params: serviceIdParamsSchema.params,
  body: z
    .object({
      categoryId: z
        .string()
        .uuid({ message: "Kategori tidak valid" })
        .nullable()
        .optional(),
      name: z
        .string()
        .trim()
        .min(1, { message: "Nama layanan wajib diisi" })
        .max(255, { message: "Nama layanan maksimal 255 karakter" })
        .optional(),
      slug: slugSchema.optional(),
      shortDescription: z
        .string()
        .trim()
        .min(1, { message: "Deskripsi singkat tidak boleh kosong" })
        .optional(),
      description: z
        .string()
        .trim()
        .min(1, { message: "Deskripsi tidak boleh kosong" })
        .optional(),
      content: z.record(z.string(), z.unknown()).optional(),
      seoTitle: z
        .string()
        .trim()
        .min(1, { message: "SEO title tidak boleh kosong" })
        .max(255, { message: "SEO title maksimal 255 karakter" })
        .optional(),
      seoDescription: z
        .string()
        .trim()
        .min(1, { message: "SEO description tidak boleh kosong" })
        .optional(),
      seoKeywords: z
        .array(z.string().trim().min(1, { message: "Keyword tidak boleh kosong" }))
        .optional(),
      canonicalUrl: z
        .string()
        .url({ message: "Canonical URL harus berupa URL yang valid" })
        .optional(),
      ogImageUrl: z
        .string()
        .url({ message: "OG Image URL harus berupa URL yang valid" })
        .optional(),
      iconName: z
        .string()
        .trim()
        .min(1, { message: "Nama ikon tidak boleh kosong" })
        .max(100, { message: "Nama ikon maksimal 100 karakter" })
        .optional(),
      featured: z.boolean().optional(),
      sortOrder: z
        .number()
        .int({ message: "Urutan harus berupa angka bulat" })
        .min(0, { message: "Urutan tidak boleh negatif" })
        .optional(),
      isPublished: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "Setidaknya satu field harus diisi",
    }),
};
