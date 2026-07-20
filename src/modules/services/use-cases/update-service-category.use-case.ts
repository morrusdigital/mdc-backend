import prisma from "../../../config/prisma";
import { ConflictError, NotFoundError } from "../../../shared/errors/app-error";
import { mapServiceCategory } from "../services.helpers";

export class UpdateServiceCategoryUseCase {
  async execute(
    id: string,
    input: {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) {
    const existing = await prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Service category not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await prisma.serviceCategory.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("Service category slug is already in use");
      }
    }

    if (input.sortOrder !== undefined && input.sortOrder !== existing.sortOrder) {
      const duplicateSortOrder = await prisma.serviceCategory.findFirst({
        where: { sortOrder: input.sortOrder, id: { not: id } },
      });

      if (duplicateSortOrder) {
        throw new ConflictError(
          `Sort order ${input.sortOrder} sudah digunakan oleh kategori "${duplicateSortOrder.name}"`
        );
      }
    }

    const category = await prisma.serviceCategory.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });

    return mapServiceCategory(category);
  }
}
