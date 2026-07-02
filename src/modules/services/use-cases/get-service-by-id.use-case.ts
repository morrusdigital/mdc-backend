import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { mapService, serviceInclude } from "../services.helpers";

export class GetServiceByIdUseCase {
  async execute(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: serviceInclude,
    });

    if (!service) {
      throw new NotFoundError("Service not found");
    }

    return mapService(service);
  }
}
