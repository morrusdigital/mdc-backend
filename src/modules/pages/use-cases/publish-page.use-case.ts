import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapPage, pageInclude } from "../pages.helpers";

export class PublishPageUseCase {
  async execute(id: string, isPublished: boolean) {
    const existing = await prisma.page.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Page not found");
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
      include: pageInclude,
    });

    return mapPage(page);
  }
}
