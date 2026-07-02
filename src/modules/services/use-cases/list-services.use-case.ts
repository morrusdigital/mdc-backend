import prisma from "../../../config/prisma";
import { mapService, serviceInclude } from "../services.helpers";

export class ListServicesUseCase {
  async execute() {
    const services = await prisma.service.findMany({
      include: serviceInclude,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return services.map(mapService);
  }
}
