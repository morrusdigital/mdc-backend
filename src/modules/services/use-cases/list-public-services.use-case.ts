import prisma from "../../../config/prisma";
import { mapService, serviceInclude } from "../services.helpers";

export class ListPublicServicesUseCase {
  async execute(categorySlug?: string) {
    const services = await prisma.service.findMany({
      where: {
        isPublished: true,
        ...(categorySlug && {
          category: {
            slug: categorySlug,
          },
        }),
      },
      include: serviceInclude,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return services.map(mapService);
  }
}
