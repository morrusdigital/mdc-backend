import prisma from "../../../config/prisma";
import { mapNavigationMenu, navigationMenuInclude } from "../navigation.helpers";

export class ListNavigationMenusUseCase {
  async execute() {
    const menus = await prisma.navigationMenu.findMany({
      include: navigationMenuInclude,
      orderBy: {
        code: "asc",
      },
    });

    return menus.map(mapNavigationMenu);
  }
}
