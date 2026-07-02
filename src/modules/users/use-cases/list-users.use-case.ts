import prisma from "../../../config/prisma";
import { mapUserSummary } from "../users.helpers";

export class ListUsersUseCase {
  async execute() {
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map(mapUserSummary);
  }
}
