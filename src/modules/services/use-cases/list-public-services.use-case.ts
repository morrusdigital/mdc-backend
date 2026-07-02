import prisma from "../../../config/prisma";
import { mapPublicService, serviceInclude } from "../services.helpers";

export class ListPublicServicesUseCase {
  async execute(filters: { categorySlug?: string; featured?: boolean }) {
    const services = await prisma.service.findMany({
      where: {
        isPublished: true,
        ...(filters.categorySlug && {
          category: {
            slug: filters.categorySlug,
          },
        }),
        ...(filters.featured !== undefined ? { featured: filters.featured } : {}),
      },
      include: serviceInclude,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return services.map(mapPublicService);
  }
}
