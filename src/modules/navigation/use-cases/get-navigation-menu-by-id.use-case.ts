import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapNavigationMenu, navigationMenuInclude } from "../navigation.helpers";

export class GetNavigationMenuByIdUseCase {
  async execute(id: string) {
    const menu = await prisma.navigationMenu.findUnique({
      where: { id },
      include: navigationMenuInclude,
    });

    if (!menu) {
      throw new NotFoundError("Navigation menu not found");
    }

    return mapNavigationMenu(menu);
  }
}
