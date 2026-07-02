import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { UnauthenticatedError } from "../../shared/errors/app-error";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
} from "../../shared/auth/token";

export const getTokenExpiration = (token: string) => {
  const decoded = jwt.decode(token) as { exp?: number } | null;

  if (!decoded?.exp) {
    throw new UnauthenticatedError("Unable to determine token expiration");
  }

  return new Date(decoded.exp * 1000);
};

export const issueSessionTokens = async (userId: number, email: string) => {
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
