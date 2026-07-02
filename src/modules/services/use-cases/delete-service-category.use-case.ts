import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";

export class DeleteServiceCategoryUseCase {
  async execute(id: string) {
    const existing = await prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Service category not found");
    }

    await prisma.serviceCategory.delete({
      where: { id },
    });
  }
}
