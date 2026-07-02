import { z } from "zod";

const siteSettingEntrySchema = z.object({
  key: z.string().min(1).max(100),
  label: z.string().min(1).max(255).optional(),
  value: z.unknown(),
  valueType: z.string().min(1).max(50),
});

export const settingsGroupParamsSchema = {
  params: z.object({
    group: z.string().min(1).max(100),
  }),
};

export const upsertSettingsGroupSchema = {
  params: settingsGroupParamsSchema.params,
  body: z.object({
    items: z.array(siteSettingEntrySchema),
  }),
};
