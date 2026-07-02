import prisma from "../../config/prisma";
import { ValidationError } from "../../shared/errors/app-error";

export const userDetailsInclude = {
  userRoles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} as const;

export const mapUserSummary = (user: any) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  roles: user.userRoles.map((userRole: any) => ({
    id: userRole.role.id,
    code: userRole.role.code,
    name: userRole.role.name,
  })),
});

export const assertRolesExist = async (roleIds: number[]) => {
  if (roleIds.length === 0) {
    return;
  }

  const count = await prisma.role.count({
    where: {
      id: {
        in: roleIds,
      },
    },
  });

  if (count !== roleIds.length) {
    throw new ValidationError("One or more role IDs are invalid");
  }
};
