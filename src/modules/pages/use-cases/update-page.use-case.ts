import prisma from "../../../config/prisma";
import { ConflictError, NotFoundError } from "../../../shared/errors/app-error";
import { mapPage, pageInclude } from "../pages.helpers";

export class UpdatePageUseCase {
  async execute(
    id: string,
    input: {
      title?: string;
      slug?: string;
      excerpt?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string[];
    }
  ) {
    const existing = await prisma.page.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Page not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await prisma.page.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("Page slug is already in use");
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription }),
        ...(input.seoKeywords !== undefined && { seoKeywords: input.seoKeywords as any }),
      },
      include: pageInclude,
    });

    return mapPage(page);
  }
}
