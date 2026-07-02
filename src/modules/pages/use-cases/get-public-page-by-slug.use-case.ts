import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapPublicPage, publicPageInclude } from "../pages.helpers";

export class GetPublicPageBySlugUseCase {
  async execute(slug: string) {
    const page = await prisma.page.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: publicPageInclude,
    });

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    return mapPublicPage(page);
  }
}
