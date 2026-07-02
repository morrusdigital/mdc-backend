import prisma from "../../../config/prisma";

export class ListPermissionsUseCase {
  async execute() {
    const permissions = await prisma.permission.findMany({
      orderBy: [{ module: "asc" }, { action: "asc" }],
    });

    return permissions.map((permission) => ({
      id: permission.id,
      code: permission.code,
      name: permission.name,
      description: permission.description,
      module: permission.module,
      action: permission.action,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    }));
  }
}
