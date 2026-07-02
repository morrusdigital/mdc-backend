import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapService, serviceInclude } from "../services.helpers";

export class GetPublicServiceBySlugUseCase {
  async execute(slug: string) {
    const service = await prisma.service.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: serviceInclude,
    });

    if (!service) {
      throw new NotFoundError("Service not found");
    }

    return mapService(service);
  }
}
