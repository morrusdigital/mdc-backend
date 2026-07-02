import prisma from "../../../config/prisma";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/app-error";
import { mapService, serviceInclude } from "../services.helpers";

export class UpdateServiceUseCase {
  async execute(
    id: string,
    input: {
      categoryId?: string | null;
      name?: string;
      slug?: string;
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
    }
  ) {
    const existing = await prisma.service.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Service not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await prisma.service.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("Service slug is already in use");
      }
    }

    if (input.categoryId) {
      const category = await prisma.serviceCategory.findUnique({
        where: { id: input.categoryId },
      });

      if (!category) {
        throw new ValidationError("Service category is invalid");
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.shortDescription !== undefined && { shortDescription: input.shortDescription }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.content !== undefined && { content: input.content as any }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription }),
        ...(input.seoKeywords !== undefined && { seoKeywords: input.seoKeywords as any }),
        ...(input.canonicalUrl !== undefined && { canonicalUrl: input.canonicalUrl }),
        ...(input.ogImageUrl !== undefined && { ogImageUrl: input.ogImageUrl }),
        ...(input.iconName !== undefined && { iconName: input.iconName }),
        ...(input.featured !== undefined && { featured: input.featured }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
      },
      include: serviceInclude,
    });

    return mapService(service);
  }
}
