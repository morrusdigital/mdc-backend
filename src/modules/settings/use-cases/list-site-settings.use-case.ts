import prisma from "../../../config/prisma";

export class ListSiteSettingsUseCase {
  async execute() {
    const settings = await prisma.siteSetting.findMany({
      orderBy: [{ group: "asc" }, { key: "asc" }],
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
