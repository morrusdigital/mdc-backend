import { z } from "zod";

const idParams = z.object({
  id: z.string().uuid(),
});

export const listMediaAssetsQuerySchema = {
  query: z.object({
    mimeType: z.string().min(1).optional(),
    search: z.string().min(1).optional(),
  }),
};

export const mediaAssetIdParamsSchema = {
  params: idParams,
};

export const createMediaAssetSchema = {
  body: z.object({
    originalName: z.string().min(1).max(255),
    mimeType: z.string().min(1).max(100),
    base64Data: z.string().min(1),
    altText: z.string().min(1).max(255).optional(),
    title: z.string().min(1).max(255).optional(),
  }),
};

export const updateMediaAssetSchema = {
  params: idParams,
  body: z
    .object({
      altText: z.string().min(1).max(255).nullable().optional(),
      title: z.string().min(1).max(255).nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
};
