import prisma from "../../../config/prisma";
import {
  ForbiddenError,
  UnauthenticatedError,
} from "../../../shared/errors/app-error";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../../shared/auth/token";
import { getUserWithAccess, toAuthProfile } from "../../../shared/auth/user-access";
import { getTokenExpiration } from "../auth.helpers";

export class RefreshAdminTokenUseCase {
  async execute(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const userId = Number(payload.sub);

    const session = await prisma.adminSession.findUnique({
      where: { id: payload.sessionId },
    });

    if (
      !session ||
      session.userId !== userId ||
      session.revokedAt ||
      session.expiresAt < new Date() ||
      session.refreshTokenHash !== hashToken(refreshToken)
    ) {
      throw new UnauthenticatedError("Refresh token is invalid or expired");
    }

    const user = await getUserWithAccess(userId);
    if (!user) {
      throw new UnauthenticatedError("Admin user does not exist");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Admin user is inactive");
    }

    const nextAccessToken = signAccessToken({
      sub: String(user.id),
      email: user.email,
      sessionId: session.id,
    });
    const nextRefreshToken = signRefreshToken({
      sub: String(user.id),
      email: user.email,
      sessionId: session.id,
    });

    await prisma.adminSession.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: hashToken(nextRefreshToken),
        expiresAt: getTokenExpiration(nextRefreshToken),
        lastUsedAt: new Date(),
      },
    });

    return {
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      user: toAuthProfile(user),
    };
  }
}
