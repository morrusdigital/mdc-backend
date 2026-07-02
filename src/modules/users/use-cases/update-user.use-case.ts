import prisma from "../../../config/prisma";
import { userDetailsInclude } from "../users.helpers";
import { hashPassword } from "../../../shared/auth/password";
import { toAuthProfile } from "../../../shared/auth/user-access";
import { ConflictError, NotFoundError } from "../../../shared/errors/app-error";

export class UpdateUserUseCase {
  async execute(
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
}
