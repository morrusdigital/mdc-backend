import prisma from "../../../config/prisma";
import {
  ForbiddenError,
  UnauthenticatedError,
} from "../../../shared/errors/app-error";
import { comparePassword } from "../../../shared/auth/password";
import { getUserWithAccess, toAuthProfile } from "../../../shared/auth/user-access";
import { issueSessionTokens } from "../auth.helpers";

export class LoginAdminUseCase {
  async execute(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthenticatedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Admin user is inactive");
    }

    const passwordMatches = await comparePassword(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthenticatedError("Invalid email or password");
    }

    const tokenBundle = await issueSessionTokens(user.id, user.email);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
      },
    });

    const userWithAccess = await getUserWithAccess(user.id);
    if (!userWithAccess) {
      throw new UnauthenticatedError("User profile no longer exists");
    }

    return {
      ...tokenBundle,
      user: toAuthProfile(userWithAccess),
    };
  }
}
