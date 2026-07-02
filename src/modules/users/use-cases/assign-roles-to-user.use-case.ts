import prisma from "../../../config/prisma";
import { assertRolesExist, userDetailsInclude } from "../users.helpers";
import { toAuthProfile } from "../../../shared/auth/user-access";
import { NotFoundError } from "../../../shared/errors/app-error";

export class AssignRolesToUserUseCase {
  async execute(id: number, roleIds: number[]) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    await assertRolesExist(roleIds);

    await prisma.$transaction([
      prisma.userRole.deleteMany({
        where: { userId: id },
      }),
      ...(roleIds.length > 0
        ? [
            prisma.userRole.createMany({
              data: roleIds.map((roleId) => ({
                userId: id,
                roleId,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),
    ]);

    const user = await prisma.user.findUnique({
      where: { id },
      include: userDetailsInclude,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return toAuthProfile(user);
  }
}
