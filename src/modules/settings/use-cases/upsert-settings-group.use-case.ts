import prisma from "../../../config/prisma";

type SiteSettingInput = {
  key: string;
  label?: string;
  value: unknown;
  valueType: string;
};

export class UpsertSettingsGroupUseCase {
  async execute(group: string, items: SiteSettingInput[]) {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.siteSetting.upsert({
          where: {
            group_key: {
              group,
              key: item.key,
            },
          },
          update: {
            label: item.label ?? null,
            value: item.value as any,
            valueType: item.valueType,
          },
          create: {
            group,
            key: item.key,
            label: item.label ?? null,
            value: item.value as any,
            valueType: item.valueType,
          },
        });
      }
    });

    const settings = await prisma.siteSetting.findMany({
      where: { group },
      orderBy: { key: "asc" },
    });

    return settings.map((setting) => ({
      id: setting.id,
      group: setting.group,
      key: setting.key,
      label: setting.label,
      value: setting.value,
      valueType: setting.valueType,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    }));
  }
}
