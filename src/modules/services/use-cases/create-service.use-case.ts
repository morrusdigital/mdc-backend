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
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    canonicalUrl?: string;
    ogImageUrl?: string;
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

    const sortOrder = input.sortOrder ?? 0;
    const duplicateSortOrder = await prisma.service.findFirst({
      where: {
        sortOrder,
        ...(input.categoryId ? { categoryId: input.categoryId } : { categoryId: null }),
      },
    });

    if (duplicateSortOrder) {
      const scope = input.categoryId
        ? `di kategori ini`
        : `tanpa kategori`;
      throw new ConflictError(
        `Sort order ${sortOrder} sudah digunakan oleh service lain ${scope}`
      );
    }

    const service = await prisma.service.create({
      data: {
        name: input.name,
        slug: input.slug,
        ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {}),
        shortDescription: input.shortDescription ?? null,
        description: input.description ?? null,
        content: input.content as any,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        seoKeywords: input.seoKeywords as any,
        canonicalUrl: input.canonicalUrl ?? null,
        ogImageUrl: input.ogImageUrl ?? null,
        iconName: input.iconName ?? null,
        featured: input.featured ?? false,
        sortOrder,
        isPublished: input.isPublished ?? false,
      },
      include: serviceInclude,
    });

    return mapService(service);
  }
}
