import prisma from "../../../config/prisma";
import { assertPermissionsExist, mapRole, roleInclude } from "../roles.helpers";
import { NotFoundError } from "../../../shared/errors/app-error";

export class AssignPermissionsToRoleUseCase {
  async execute(id: number, permissionIds: number[]) {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    await assertPermissionsExist(permissionIds);

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({
        where: { roleId: id },
      }),
      ...(permissionIds.length > 0
        ? [
            prisma.rolePermission.createMany({
              data: permissionIds.map((permissionId) => ({
                roleId: id,
                permissionId,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),
    ]);

    const updatedRole = await prisma.role.findUnique({
      where: { id },
      include: roleInclude,
    });

    if (!updatedRole) {
      throw new NotFoundError("Role not found");
    }

    return mapRole(updatedRole);
  }
}
