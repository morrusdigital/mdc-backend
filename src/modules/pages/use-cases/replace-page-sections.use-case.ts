import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapPage, pageInclude } from "../pages.helpers";

type SectionInput = {
  type: string;
  label?: string;
  sortOrder: number;
  isEnabled?: boolean;
  content: Record<string, unknown>;
};

export class ReplacePageSectionsUseCase {
  async execute(id: string, sections: SectionInput[]) {
    const existing = await prisma.page.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Page not found");
    }

    const page = await prisma.$transaction(async (tx) => {
      await tx.pageSection.deleteMany({
        where: { pageId: id },
      });

      if (sections.length > 0) {
        await tx.pageSection.createMany({
          data: sections.map((section) => ({
            pageId: id,
            type: section.type,
            label: section.label ?? null,
            sortOrder: section.sortOrder,
            isEnabled: section.isEnabled ?? true,
            content: section.content as any,
          })),
        });
      }

      return tx.page.findUnique({
        where: { id },
        include: pageInclude,
      });
    });

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    return mapPage(page);
  }
}
