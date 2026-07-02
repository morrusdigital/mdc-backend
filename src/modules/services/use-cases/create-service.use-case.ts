import prisma from "../../../config/prisma";
import { ConflictError, ValidationError } from "../../../shared/errors/app-error";
import { mapService, serviceInclude } from "../services.helpers";

export class CreateServiceUseCase {
  async execute(input: {
    categoryId?: string;
    name: string;
    slug: string;
    shortDescription?: string;
    description?: string;
    content?: Record<string, unknown>;
    iconName?: string;
    featured?: boolean;
    sortOrder?: number;
    isPublished?: boolean;
  }) {
    const existing = await prisma.service.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("Service slug is already in use");
    }

    if (input.categoryId) {
      const category = await prisma.serviceCategory.findUnique({
        where: { id: input.categoryId },
      });

      if (!category) {
        throw new ValidationError("Service category is invalid");
      }
    }

    const service = await prisma.service.create({
      data: {
        name: input.name,
        slug: input.slug,
        ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {}),
        shortDescription: input.shortDescription ?? null,
        description: input.description ?? null,
        content: input.content as any,
        iconName: input.iconName ?? null,
        featured: input.featured ?? false,
        sortOrder: input.sortOrder ?? 0,
        isPublished: input.isPublished ?? false,
      },
      include: serviceInclude,
    });

    return mapService(service);
  }
}
