import prisma from "../../../config/prisma";
import { userDetailsInclude } from "../users.helpers";
import { flattenPermissions, toAuthProfile } from "../../../shared/auth/user-access";
import { NotFoundError } from "../../../shared/errors/app-error";

export class GetUserByIdUseCase {
  async execute(id: number) {
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
}
