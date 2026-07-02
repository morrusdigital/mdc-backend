import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";

export class DeleteServiceUseCase {
  async execute(id: string) {
    const existing = await prisma.service.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Service not found");
    }

    await prisma.service.delete({
      where: { id },
    });
  }
}
