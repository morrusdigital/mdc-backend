import prisma from "../../config/prisma";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/errors/app-error";

const roleInclude = {
  rolePermissions: {
    include: {
      permission: true,
    },
  },
} as const;

const mapRole = (role: any) => ({
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

const assertPermissionsExist = async (permissionIds: number[]) => {
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

export class RolesService {
  async listRoles() {
    const roles = await prisma.role.findMany({
      include: roleInclude,
      orderBy: {
        createdAt: "asc",
      },
    });

    return roles.map(mapRole);
  }

  async getRoleById(id: number) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: roleInclude,
    });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    return mapRole(role);
  }

  async createRole(input: {
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

  async updateRole(
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

  async deleteRole(id: number) {
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

  async assignPermissions(id: number, permissionIds: number[]) {
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
