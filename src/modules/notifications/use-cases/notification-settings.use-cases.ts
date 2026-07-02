import prisma from "../../../config/prisma";
import { recordAuditLog } from "../../../shared/audit/audit.service";

const db = prisma as any;

const mapNotificationSetting = (setting: any) => ({
  id: setting.id,
  channel: setting.channel,
  event: setting.event,
  isEnabled: setting.isEnabled,
  config: setting.config,
  createdAt: setting.createdAt,
  updatedAt: setting.updatedAt,
});

export class ListNotificationSettingsUseCase {
  async execute() {
    const settings = await db.notificationSetting.findMany({
      orderBy: [{ event: "asc" }, { channel: "asc" }],
    });

    return settings.map(mapNotificationSetting);
  }
}

export class UpsertNotificationSettingUseCase {
  async execute(
    channel: "email" | "webhook",
    event: string,
    input: {
      isEnabled: boolean;
      config: Record<string, unknown>;
    },
    actor: {
      actorId: number;
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
    }
  ) {
    const setting = await db.notificationSetting.upsert({
      where: {
        channel_event: {
          channel,
          event,
        },
      },
      update: {
        isEnabled: input.isEnabled,
        config: input.config as any,
      },
      create: {
        channel,
        event,
        isEnabled: input.isEnabled,
        config: input.config as any,
      },
    });

    await recordAuditLog({
      actorId: actor.actorId,
      module: "notifications",
      action: "upsert",
      entityType: "notification_setting",
      entityId: setting.id,
      summary: `Notification setting ${event}/${channel} updated`,
      payload: input,
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return mapNotificationSetting(setting);
  }
}
