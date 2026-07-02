import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { publicSettingsGroups } from "../../../shared/public-content/public-content";

export class GetSettingsGroupUseCase {
  async execute(group: string) {
    if (!publicSettingsGroups.has(group)) {
      throw new NotFoundError("Site setting group not found");
    }

    const settings = await prisma.siteSetting.findMany({
      where: { group },
      orderBy: { key: "asc" },
    });

    return settings.map((setting) => ({
      group: setting.group,
      key: setting.key,
      label: setting.label,
      value: setting.value,
      valueType: setting.valueType,
    }));
  }
}
