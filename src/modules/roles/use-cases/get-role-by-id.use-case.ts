import prisma from "../../../config/prisma";
import { mapRole, roleInclude } from "../roles.helpers";
import { NotFoundError } from "../../../shared/errors/app-error";

export class GetRoleByIdUseCase {
  async execute(id: number) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: roleInclude,
    });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    return mapRole(role);
  }
}
