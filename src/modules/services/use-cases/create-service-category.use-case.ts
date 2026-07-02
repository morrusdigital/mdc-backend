import prisma from "../../../config/prisma";
import { ConflictError } from "../../../shared/errors/app-error";
import { mapServiceCategory } from "../services.helpers";

export class CreateServiceCategoryUseCase {
  async execute(input: {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    const existing = await prisma.serviceCategory.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("Service category slug is already in use");
    }

    const category = await prisma.serviceCategory.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? true,
      },
    });

    return mapServiceCategory(category);
  }
}
