import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapNavigationMenu, publicNavigationMenuInclude } from "../navigation.helpers";

export class GetPublicNavigationByCodeUseCase {
  async execute(code: string) {
    const menu = await prisma.navigationMenu.findUnique({
      where: { code },
      include: publicNavigationMenuInclude,
    });

    if (!menu) {
      throw new NotFoundError("Navigation menu not found");
    }

    return mapNavigationMenu(menu);
  }
}
