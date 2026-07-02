import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prisma";
import {
  ForbiddenError,
  UnauthenticatedError,
} from "../errors/app-error";
import { getRoleCodes, getUserWithAccess, flattenPermissions } from "../auth/user-access";
import { verifyAccessToken } from "../auth/token";

const parseBearerToken = (authorization?: string) => {
  if (!authorization) {
    throw new UnauthenticatedError("Missing Authorization header");
  }

  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !token) {
    throw new UnauthenticatedError("Invalid authorization header format");
  }

  return token;
};

export const requireAuth =
  () => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = parseBearerToken(req.headers.authorization);
      const payload = verifyAccessToken(token);
      const userId = Number(payload.sub);

      if (Number.isNaN(userId)) {
        throw new UnauthenticatedError("Invalid token subject");
      }

      const session = await prisma.adminSession.findUnique({
        where: { id: payload.sessionId },
      });

      if (!session || session.userId !== userId || session.revokedAt || session.expiresAt < new Date()) {
        throw new UnauthenticatedError("Session is no longer active");
      }

      const user = await getUserWithAccess(userId);

      if (!user || !user.isActive) {
        throw new UnauthenticatedError("Admin user is not active");
      }

      req.authUser = {
        id: user.id,
        email: user.email,
        roles: getRoleCodes(user),
        permissions: flattenPermissions(user),
        sessionId: session.id,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

export const requirePermission =
  (...requiredPermissions: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.authUser) {
        throw new UnauthenticatedError("Authentication is required");
      }

      const hasPermission = requiredPermissions.every((permission) =>
        req.authUser?.permissions.includes(permission)
      );

      if (!hasPermission) {
        throw new ForbiddenError("You do not have permission to access this resource");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
