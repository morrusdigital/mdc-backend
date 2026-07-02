import prisma from "../../../config/prisma";
import { ConflictError } from "../../../shared/errors/app-error";
import { mapPage, pageInclude } from "../pages.helpers";

type SectionInput = {
  type: string;
  label?: string;
  sortOrder: number;
  isEnabled?: boolean;
  content: Record<string, unknown>;
};

export class CreatePageUseCase {
  async execute(input: {
    title: string;
    slug: string;
    excerpt?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    canonicalUrl?: string;
    ogImageUrl?: string;
    sections?: SectionInput[];
  }) {
    const existing = await prisma.page.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("Page slug is already in use");
    }

    const page = await prisma.page.create({
      data: {
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt ?? null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        seoKeywords: input.seoKeywords as any,
        canonicalUrl: input.canonicalUrl ?? null,
        ogImageUrl: input.ogImageUrl ?? null,
        ...(input.sections && input.sections.length > 0
          ? {
              sections: {
                create: input.sections.map((section) => ({
                  type: section.type,
                  label: section.label ?? null,
                  sortOrder: section.sortOrder,
                  isEnabled: section.isEnabled ?? true,
                  content: section.content as any,
                })),
              },
            }
          : {}),
      },
      include: pageInclude,
    });

    return mapPage(page);
  }
}
