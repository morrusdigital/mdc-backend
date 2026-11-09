import { z } from "zod";

const slug = z.string().trim().min(1, "Slug wajib diisi").max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda strip");
const id = z.string().uuid("ID tidak valid");
const solution = z.object({
  name: z.string().trim().min(1, "Nama solusi wajib diisi").max(255),
  type: z.enum(["Website", "Aplikasi/Sistem"]),
  description: z.string().trim().min(1, "Deskripsi solusi wajib diisi"),
  benefits: z.array(z.string().trim().min(1)).min(1, "Minimal satu manfaat"),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const industryIdParamsSchema = { params: z.object({ id }) };
export const industrySlugParamsSchema = { params: z.object({ slug: z.string().min(1) }) };
export const industrySolutionParamsSchema = { params: z.object({ industryId: id, solutionId: id }) };
export const createIndustrySchema = { body: z.object({
  name: z.string().trim().min(1, "Nama industri wajib diisi").max(255), slug, summary: z.string().trim().min(1, "Ringkasan wajib diisi"),
  hero: z.string().trim().optional(), coverImage: z.string().trim().refine((value) => /^https?:\/\//.test(value) || value.startsWith("/"), "Cover image harus berupa URL atau path publik").optional(), sortOrder: z.number().int().min(0).optional(), isPublished: z.boolean().optional(),
  seoTitle: z.string().trim().max(255).optional(), seoDescription: z.string().trim().optional(), seoKeywords: z.array(z.string().trim().min(1)).optional(),
}) };
export const updateIndustrySchema = { params: industryIdParamsSchema.params, body: createIndustrySchema.body.partial().refine((v) => Object.keys(v).length > 0, "Setidaknya satu field harus diisi") };
export const createSolutionSchema = { params: z.object({ industryId: id }), body: solution };
export const updateSolutionSchema = { params: industrySolutionParamsSchema.params, body: solution.partial().refine((v) => Object.keys(v).length > 0, "Setidaknya satu field harus diisi") };
