import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, { message: "Slug wajib diisi" })
  .max(255, { message: "Slug maksimal 255 karakter" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug hanya boleh huruf kecil, angka, dan tanda strip (contoh: john-doe)",
  });

const booleanQuerySchema = z.enum(["true", "false"]).transform((value) => value === "true");

const teamMemberBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Nama wajib diisi" })
    .max(255, { message: "Nama maksimal 255 karakter" }),
  slug: slugSchema,
  jobTitle: z
    .string()
    .trim()
    .min(1, { message: "Jabatan wajib diisi" })
    .max(255, { message: "Jabatan maksimal 255 karakter" }),
  bio: z
    .string()
    .trim()
    .min(1, { message: "Bio wajib diisi" }),
  photoUrl: z
    .string()
    .url({ message: "Photo URL harus berupa URL yang valid" })
    .max(2048, { message: "Photo URL maksimal 2048 karakter" })
    .optional(),
  linkedinUrl: z
    .string()
    .url({ message: "LinkedIn URL harus berupa URL yang valid" })
    .max(2048, { message: "LinkedIn URL maksimal 2048 karakter" })
    .optional(),
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
    .max(2048, { message: "Canonical URL maksimal 2048 karakter" })
    .optional(),
  ogImageUrl: z
    .string()
    .url({ message: "OG Image URL harus berupa URL yang valid" })
    .max(2048, { message: "OG Image URL maksimal 2048 karakter" })
    .optional(),
  sortOrder: z
    .number()
    .int({ message: "Urutan harus berupa angka bulat" })
    .min(0, { message: "Urutan tidak boleh negatif" })
    .optional(),
  featured: z.boolean().optional(),
});

export const teamMemberIdParamsSchema = {
  params: z.object({
    id: z.string().uuid({ message: "ID team member tidak valid" }),
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
    message: "Setidaknya satu field harus diisi",
  }),
};

export const updateTeamWorkflowParamsSchema = {
  params: teamMemberIdParamsSchema.params,
};

export const scheduleTeamMemberSchema = {
  params: teamMemberIdParamsSchema.params,
  body: z.object({
    publishedAt: z.coerce.date({ message: "Tanggal publikasi tidak valid" }),
  }),
};

export const publicTeamMembersQuerySchema = {
  query: z.object({
    featured: booleanQuerySchema.optional(),
  }),
};
