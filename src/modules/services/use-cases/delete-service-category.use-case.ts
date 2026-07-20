import prisma from "../../../config/prisma";
import { NotFoundError, ValidationError } from "../../../shared/errors/app-error";

export class DeleteServiceCategoryUseCase {
  async execute(id: string) {
    const existing = await prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Service category not found");
    }

    const serviceCount = await prisma.service.count({
      where: { categoryId: id },
    });

    if (serviceCount > 0) {
      throw new ValidationError(
        `Tidak dapat menghapus kategori "${existing.name}" karena masih memiliki ${serviceCount} layanan terkait. Hapus atau pindahkan layanan terlebih dahulu.`
      );
    }

    await prisma.serviceCategory.delete({
      where: { id },
    });
  }
}
