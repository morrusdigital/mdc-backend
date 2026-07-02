import prisma from "../../config/prisma";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/errors/app-error";
import { hashPassword } from "../../shared/auth/password";
import { flattenPermissions, toAuthProfile } from "../../shared/auth/user-access";

const userDetailsInclude = {
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

const mapUserSummary = (user: any) => ({
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

const assertRolesExist = async (roleIds: number[]) => {
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

export class UsersService {
  async listUsers() {
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

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: userDetailsInclude,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      ...toAuthProfile(user),
      permissions: flattenPermissions(user),
    };
  }

  async createUser(input: {
    email: string;
    name?: string;
    password: string;
    isActive?: boolean;
    roleIds?: number[];
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError("Email is already in use");
    }

    const roleIds = input.roleIds ?? [];
    await assertRolesExist(roleIds);

    const passwordHash = await hashPassword(input.password);

    const data = {
      email: input.email,
      passwordHash,
      isActive: input.isActive ?? true,
      ...(input.name !== undefined && { name: input.name }),
      ...(roleIds.length > 0 && {
        userRoles: {
          createMany: {
            data: roleIds.map((roleId) => ({ roleId })),
          },
        },
      }),
    };

    const user = await prisma.user.create({
      data,
      include: userDetailsInclude,
    });

    return toAuthProfile(user);
  }

  async updateUser(
    id: number,
    input: {
      email?: string;
      name?: string;
      password?: string;
    }
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    if (input.email && input.email !== existingUser.email) {
      const duplicate = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (duplicate) {
        throw new ConflictError("Email is already in use");
      }
    }

    const data = {
      ...(input.email !== undefined && { email: input.email }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.password !== undefined && {
        passwordHash: await hashPassword(input.password),
      }),
    };

    const user = await prisma.user.update({
      where: { id },
      data,
      include: userDetailsInclude,
    });

    return toAuthProfile(user);
  }

  async updateUserStatus(id: number, isActive: boolean) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      include: userDetailsInclude,
    });

    return toAuthProfile(user);
  }

  async assignRoles(id: number, roleIds: number[]) {
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
