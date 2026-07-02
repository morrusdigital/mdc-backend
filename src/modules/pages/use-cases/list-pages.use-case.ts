import prisma from "../../../config/prisma";
import { mapPage, pageInclude } from "../pages.helpers";

export class ListPagesUseCase {
  async execute() {
    const pages = await prisma.page.findMany({
      include: pageInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return pages.map(mapPage);
  }
}
