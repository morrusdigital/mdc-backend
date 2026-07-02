import prisma from "../../config/prisma";

const userAuthorizationInclude = {
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

export const getUserWithAccess = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: userAuthorizationInclude,
  });
};

export const flattenPermissions = (
  user: NonNullable<Awaited<ReturnType<typeof getUserWithAccess>>>
) => {
  return Array.from(
    new Set(
      user.userRoles.flatMap((userRole) =>
        userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.code)
      )
    )
  ).sort();
};

export const getRoleCodes = (
  user: NonNullable<Awaited<ReturnType<typeof getUserWithAccess>>>
) => {
  return user.userRoles.map((userRole) => userRole.role.code).sort();
};

export const toAuthProfile = (
  user: NonNullable<Awaited<ReturnType<typeof getUserWithAccess>>>
) => {
  const permissions = flattenPermissions(user);
  const roles = user.userRoles.map((userRole) => ({
    id: userRole.role.id,
    code: userRole.role.code,
    name: userRole.role.name,
  }));

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles,
    permissions,
  };
};
