import prisma from "../../../config/prisma";
import { assertRolesExist, userDetailsInclude } from "../users.helpers";
import { hashPassword } from "../../../shared/auth/password";
import { toAuthProfile } from "../../../shared/auth/user-access";
import { ConflictError } from "../../../shared/errors/app-error";

export class CreateUserUseCase {
  async execute(input: {
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
}
