import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapPage, pageInclude } from "../pages.helpers";

export class GetPageByIdUseCase {
  async execute(id: string) {
    const page = await prisma.page.findUnique({
      where: { id },
      include: pageInclude,
    });

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    return mapPage(page);
  }
}
