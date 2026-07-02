import prisma from "../../../config/prisma";
import { userDetailsInclude } from "../users.helpers";
import { toAuthProfile } from "../../../shared/auth/user-access";
import { NotFoundError } from "../../../shared/errors/app-error";

export class UpdateUserStatusUseCase {
  async execute(id: number, isActive: boolean) {
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
}
