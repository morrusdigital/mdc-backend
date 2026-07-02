import prisma from "../../../config/prisma";
import { assertPermissionsExist, mapRole, roleInclude } from "../roles.helpers";
import { ConflictError } from "../../../shared/errors/app-error";

export class CreateRoleUseCase {
  async execute(input: {
    code: string;
    name: string;
    description?: string;
    permissionIds?: number[];
  }) {
    const existingRole = await prisma.role.findUnique({
      where: { code: input.code },
    });

    if (existingRole) {
      throw new ConflictError("Role code is already in use");
    }

    const permissionIds = input.permissionIds ?? [];
    await assertPermissionsExist(permissionIds);

    const data = {
      code: input.code,
      name: input.name,
      ...(input.description !== undefined && { description: input.description }),
      ...(permissionIds.length > 0 && {
        rolePermissions: {
          createMany: {
            data: permissionIds.map((permissionId) => ({
              permissionId,
            })),
          },
        },
      }),
    };

    const role = await prisma.role.create({
      data,
      include: roleInclude,
    });

    return mapRole(role);
  }
}
