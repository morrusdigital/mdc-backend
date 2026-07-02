import prisma from "../../../config/prisma";

export class GetSettingsGroupUseCase {
  async execute(group: string) {
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
