import crypto from "crypto";
import prisma from "../../../config/prisma";
import { NotFoundError, ValidationError } from "../../../shared/errors/app-error";
import { mapNavigationMenu, navigationMenuInclude } from "../navigation.helpers";

type NavigationItemInput = {
  id?: string;
  parentId?: string | null;
  pageId?: string | null;
  label: string;
  url: string;
  target?: string;
  sortOrder: number;
  isActive?: boolean;
};

export class ReplaceNavigationItemsUseCase {
  async execute(id: string, items: NavigationItemInput[]) {
    const menu = await prisma.navigationMenu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundError("Navigation menu not found");
    }

    const pageIds = items
      .map((item) => item.pageId)
      .filter((value): value is string => typeof value === "string");

    if (pageIds.length > 0) {
      const pagesCount = await prisma.page.count({
        where: {
          id: {
            in: pageIds,
          },
        },
      });

      if (pagesCount !== pageIds.length) {
        throw new ValidationError("One or more referenced pages are invalid");
      }
    }

    const effectiveIds = new Set(items.map((item) => item.id || crypto.randomUUID()));
    const parentIds = items
      .map((item) => item.parentId)
      .filter((value): value is string => typeof value === "string");

    for (const parentId of parentIds) {
      if (!effectiveIds.has(parentId)) {
        throw new ValidationError("Navigation item parentId must reference an item in the same menu payload");
      }
    }

    const updatedMenu = await prisma.$transaction(async (tx) => {
      await tx.navigationItem.deleteMany({
        where: { menuId: id },
      });

      if (items.length > 0) {
        const preparedItems = items.map((item) => ({
          id: item.id || crypto.randomUUID(),
          menuId: id,
          parentId: item.parentId ?? null,
          pageId: item.pageId ?? null,
          label: item.label,
          url: item.url,
          target: item.target ?? null,
          sortOrder: item.sortOrder,
          isActive: item.isActive ?? true,
        }));

        await tx.navigationItem.createMany({
          data: preparedItems,
        });
      }

      return tx.navigationMenu.findUnique({
        where: { id },
        include: navigationMenuInclude,
      });
    });

    if (!updatedMenu) {
      throw new NotFoundError("Navigation menu not found");
    }

    return mapNavigationMenu(updatedMenu);
  }
}
