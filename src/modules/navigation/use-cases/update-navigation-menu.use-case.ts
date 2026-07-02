import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapNavigationMenu, navigationMenuInclude } from "../navigation.helpers";

export class UpdateNavigationMenuUseCase {
  async execute(
    id: string,
    input: {
      name?: string;
      description?: string;
    }
  ) {
    const existing = await prisma.navigationMenu.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Navigation menu not found");
    }

    const menu = await prisma.navigationMenu.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
      },
      include: navigationMenuInclude,
    });

    return mapNavigationMenu(menu);
  }
}
