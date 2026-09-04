import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, { message: "Slug wajib diisi" })
  .max(255, { message: "Slug maksimal 255 karakter" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug hanya boleh huruf kecil, angka, dan tanda strip (contoh: bootcamp-online)",
  });

const competencySchema = z.object({
  element: z.string().trim().min(1, { message: "Element competency wajib diisi" }),
  criteria: z.array(z.string().trim().min(1, { message: "Criteria competency wajib diisi" })),
});

const syllabusModuleSchema = z.object({
  code: z.string().trim().min(1, { message: "Kode modul tidak boleh kosong" }).optional(),
  title: z.string().trim().min(1, { message: "Judul modul wajib diisi" }),
  description: z.string().trim().min(1, { message: "Deskripsi modul wajib diisi" }),
  competencies: z.array(competencySchema).optional(),
});

const classPlanSchema = z.object({
  day: z.string().trim().min(1, { message: "Hari wajib diisi" }),
  title: z.string().trim().min(1, { message: "Judul sesi wajib diisi" }),
  activities: z.array(z.string().trim().min(1, { message: "Aktivitas wajib diisi" })).min(1, {
    message: "Minimal satu aktivitas wajib diisi",
  }),
});

const trackSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, { message: "Judul track wajib diisi" }).max(255),
  icon: z.string().trim().min(1, { message: "Icon wajib diisi" }).max(100),
  price: z.number().int({ message: "Harga harus bilangan bulat" }).min(0),
  description: z.string().trim().min(1, { message: "Deskripsi track wajib diisi" }),
  syllabusModules: z.array(syllabusModuleSchema).min(1, { message: "Minimal satu modul silabus wajib diisi" }),
  classPlan: z.array(classPlanSchema).optional(),
  syllabusStatus: z.string().trim().min(1, { message: "Status silabus wajib diisi" }),
  scheduleStatus: z.string().trim().min(1, { message: "Status jadwal wajib diisi" }),
});

const academyProgramBodySchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, { message: "Judul program wajib diisi" }).max(255),
  shortTitle: z.string().trim().min(1, { message: "Judul singkat wajib diisi" }).max(255),
  priceFrom: z.number().int({ message: "Harga mulai harus bilangan bulat" }).min(0),
  duration: z.string().trim().min(1, { message: "Durasi wajib diisi" }).max(100),
  format: z.string().trim().min(1, { message: "Format wajib diisi" }).max(100),
  audience: z.string().trim().min(1, { message: "Audience wajib diisi" }),
  image: z.string().trim().min(1, { message: "Image wajib diisi" }),
  description: z.string().trim().min(1, { message: "Deskripsi wajib diisi" }),
  overview: z.string().trim().min(1, { message: "Overview wajib diisi" }),
  highlights: z.array(z.string().trim().min(1, { message: "Highlight wajib diisi" })).min(1, {
    message: "Minimal satu highlight wajib diisi",
  }),
  tracks: z.array(trackSchema).min(1, { message: "Minimal satu track wajib diisi" }),
  seoTitle: z.string().trim().min(1, { message: "SEO title wajib diisi" }).max(70).optional(),
  seoDescription: z.string().trim().min(1, { message: "SEO description wajib diisi" }).max(160).optional(),
  seoKeywords: z.array(z.string().trim().min(1).max(50)).max(10).optional(),
  canonicalUrl: z.string().url({ message: "Canonical URL harus valid" }).optional(),
  ogImageUrl: z.string().url({ message: "OG Image URL harus valid" }).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int({ message: "Urutan harus berupa angka bulat" }).min(0).optional(),
  isPublished: z.boolean().optional(),
});

export const academyProgramIdParamsSchema = {
  params: z.object({
    id: z.string().uuid({ message: "ID academy program tidak valid" }),
  }),
};

export const academyProgramSlugParamsSchema = {
  params: z.object({
    slug: z.string().min(1),
  }),
};

export const academyProgramTrackParamsSchema = {
  params: z.object({
    programSlug: z.string().min(1),
    trackSlug: z.string().min(1),
  }),
};

export const publicAcademyProgramsQuerySchema = {
  query: z.object({
    featured: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  }),
};

export const createAcademyProgramSchema = {
  body: academyProgramBodySchema,
};

export const updateAcademyProgramSchema = {
  params: academyProgramIdParamsSchema.params,
  body: academyProgramBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "Setidaknya satu field harus diisi",
  }),
};
