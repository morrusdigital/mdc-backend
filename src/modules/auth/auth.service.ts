import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import {
  ForbiddenError,
  UnauthenticatedError,
} from "../../shared/errors/app-error";
import { comparePassword } from "../../shared/auth/password";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../shared/auth/token";
import { getUserWithAccess, toAuthProfile } from "../../shared/auth/user-access";

const getTokenExpiration = (token: string) => {
  const decoded = jwt.decode(token) as { exp?: number } | null;

  if (!decoded?.exp) {
    throw new UnauthenticatedError("Unable to determine token expiration");
  }

  return new Date(decoded.exp * 1000);
};

const issueSessionTokens = async (userId: number, email: string) => {
  const sessionId = crypto.randomUUID();
  const accessToken = signAccessToken({
    sub: String(userId),
    email,
    sessionId,
  });
  const refreshToken = signRefreshToken({
    sub: String(userId),
    email,
    sessionId,
  });

  await prisma.adminSession.create({
    data: {
      id: sessionId,
      userId,
      refreshTokenHash: hashToken(refreshToken),
      expiresAt: getTokenExpiration(refreshToken),
      lastUsedAt: new Date(),
    },
  });

  return {
    accessToken,
    refreshToken,
    sessionId,
  };
};

export class AuthService {
  async login(email: string, password: string) {
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

  async refresh(refreshToken: string) {
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

  async logout(sessionId: string) {
    await prisma.adminSession.updateMany({
      where: {
        id: sessionId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async me(userId: number) {
    const user = await getUserWithAccess(userId);
    if (!user) {
      throw new UnauthenticatedError("Admin user does not exist");
    }

    return toAuthProfile(user);
  }
}
