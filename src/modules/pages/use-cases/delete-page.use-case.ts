import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";

export class DeletePageUseCase {
  async execute(id: string) {
    const existing = await prisma.page.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Page not found");
    }

    await prisma.page.delete({
      where: { id },
    });
  }
}
