import prisma from "../../config/prisma";
import { ValidationError } from "../../shared/errors/app-error";

export const roleInclude = {
  rolePermissions: {
    include: {
      permission: true,
    },
  },
} as const;

export const mapRole = (role: any) => ({
  id: role.id,
  code: role.code,
  name: role.name,
  description: role.description,
  isSystem: role.isSystem,
  createdAt: role.createdAt,
  updatedAt: role.updatedAt,
  permissions: role.rolePermissions.map((item: any) => ({
    id: item.permission.id,
    code: item.permission.code,
    name: item.permission.name,
    module: item.permission.module,
    action: item.permission.action,
  })),
});

export const assertPermissionsExist = async (permissionIds: number[]) => {
  if (permissionIds.length === 0) {
    return;
  }

  const count = await prisma.permission.count({
    where: {
      id: {
        in: permissionIds,
      },
    },
  });

  if (count !== permissionIds.length) {
    throw new ValidationError("One or more permission IDs are invalid");
  }
};
