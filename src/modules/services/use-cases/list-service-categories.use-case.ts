import prisma from "../../../config/prisma";
import { mapServiceCategory } from "../services.helpers";

export class ListServiceCategoriesUseCase {
  async execute() {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return categories.map(mapServiceCategory);
  }
}
