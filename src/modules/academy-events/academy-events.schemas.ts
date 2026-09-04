import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, { message: "Slug wajib diisi" })
  .max(255, { message: "Slug maksimal 255 karakter" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug hanya boleh huruf kecil, angka, dan tanda strip",
  });

const academyEventBodySchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, { message: "Judul event wajib diisi" }).max(255),
  category: z.string().trim().min(1, { message: "Kategori wajib diisi" }).max(255),
  summary: z.string().trim().min(1, { message: "Ringkasan wajib diisi" }),
  startDate: z.string().datetime({ message: "Start date harus valid" }),
  endDate: z.string().datetime({ message: "End date harus valid" }),
  dateLabel: z.string().trim().min(1, { message: "Label tanggal wajib diisi" }).max(255),
  timeLabel: z.string().trim().min(1, { message: "Label waktu wajib diisi" }).max(255),
  location: z.string().trim().min(1, { message: "Lokasi wajib diisi" }).max(255),
  price: z.number().int({ message: "Harga harus bilangan bulat" }).min(0),
  priceLabel: z.string().trim().min(1, { message: "Label harga wajib diisi" }).max(255),
  seatLabel: z.string().trim().min(1, { message: "Label kuota wajib diisi" }).max(255),
  image: z.string().trim().min(1, { message: "Image wajib diisi" }),
  learnings: z.array(z.string().trim().min(1, { message: "Learning wajib diisi" })).min(1, {
    message: "Minimal satu learning wajib diisi",
  }),
  seoTitle: z.string().trim().min(1).max(70).optional(),
  seoDescription: z.string().trim().min(1).max(160).optional(),
  seoKeywords: z.array(z.string().trim().min(1).max(50)).max(10).optional(),
  canonicalUrl: z.string().url({ message: "Canonical URL harus valid" }).optional(),
  ogImageUrl: z.string().url({ message: "OG Image URL harus valid" }).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int({ message: "Urutan harus berupa angka bulat" }).min(0).optional(),
  isPublished: z.boolean().optional(),
});

export const academyEventIdParamsSchema = {
  params: z.object({
    id: z.string().uuid({ message: "ID academy event tidak valid" }),
  }),
};

export const academyEventSlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const publicAcademyEventsQuerySchema = {
  query: z.object({
    featured: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  }),
};

export const createAcademyEventSchema = {
  body: academyEventBodySchema,
};

export const updateAcademyEventSchema = {
  params: academyEventIdParamsSchema.params,
  body: academyEventBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "Setidaknya satu field harus diisi",
  }),
};
