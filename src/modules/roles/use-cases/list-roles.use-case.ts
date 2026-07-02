import prisma from "../../../config/prisma";
import { mapRole, roleInclude } from "../roles.helpers";

export class ListRolesUseCase {
  async execute() {
    const roles = await prisma.role.findMany({
      include: roleInclude,
      orderBy: {
        createdAt: "asc",
      },
    });

    return roles.map(mapRole);
  }
}
