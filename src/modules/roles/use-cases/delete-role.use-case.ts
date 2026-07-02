import prisma from "../../../config/prisma";
import { NotFoundError, ValidationError } from "../../../shared/errors/app-error";

export class DeleteRoleUseCase {
  async execute(id: number) {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    const userAssignmentsCount = await prisma.userRole.count({
      where: {
        roleId: id,
      },
    });

    if (userAssignmentsCount > 0) {
      throw new ValidationError("Role cannot be deleted while it is still assigned to users");
    }

    await prisma.role.delete({
      where: { id },
    });
  }
}
