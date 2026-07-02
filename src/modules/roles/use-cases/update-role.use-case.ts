import prisma from "../../../config/prisma";
import { mapRole, roleInclude } from "../roles.helpers";
import { ConflictError, NotFoundError } from "../../../shared/errors/app-error";

export class UpdateRoleUseCase {
  async execute(
    id: number,
    input: {
      code?: string;
      name?: string;
      description?: string | null;
    }
  ) {
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundError("Role not found");
    }

    if (input.code && input.code !== existingRole.code) {
      const duplicate = await prisma.role.findUnique({
        where: { code: input.code },
      });

      if (duplicate) {
        throw new ConflictError("Role code is already in use");
      }
    }

    const data = {
      ...(input.code !== undefined && { code: input.code }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
    };

    const role = await prisma.role.update({
      where: { id },
      data,
      include: roleInclude,
    });

    return mapRole(role);
  }
}
