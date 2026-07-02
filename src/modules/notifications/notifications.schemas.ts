import { z } from "zod";

export const notificationSettingParamsSchema = {
  params: z.object({
    channel: z.enum(["email", "webhook"]),
    event: z.string().min(1).max(100),
  }),
};

export const updateNotificationSettingSchema = {
  params: notificationSettingParamsSchema.params,
  body: z.object({
    isEnabled: z.boolean(),
    config: z.record(z.string(), z.unknown()),
  }),
};
