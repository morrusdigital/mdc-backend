import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
import { UnauthenticatedError } from "../errors/app-error";

type TokenKind = "access" | "refresh";

export interface BaseTokenPayload {
  sub: string;
  email: string;
  sessionId: string;
  type: TokenKind;
}

export interface AccessTokenPayload extends BaseTokenPayload {
  type: "access";
}

export interface RefreshTokenPayload extends BaseTokenPayload {
  type: "refresh";
}

const getEnv = (key: string, fallback: string) => {
  return process.env[key] || fallback;
};

const accessSecret = getEnv("JWT_ACCESS_SECRET", "mdc-dev-access-secret");
const refreshSecret = getEnv("JWT_REFRESH_SECRET", "mdc-dev-refresh-secret");
const accessTtl = getEnv("JWT_ACCESS_TTL", "15m");
const refreshTtl = getEnv("JWT_REFRESH_TTL", "7d");

const signToken = (
  payload: BaseTokenPayload,
  secret: string,
  expiresIn: string
) => {
  const options: SignOptions = {
    expiresIn: expiresIn as StringValue,
  };

  return jwt.sign(payload, secret, options);
};

const verifyToken = <TPayload extends BaseTokenPayload>(
  token: string,
  secret: string,
  expectedType: TokenKind
): TPayload => {
  try {
    const decoded = jwt.verify(token, secret) as TPayload;

    if (decoded.type !== expectedType) {
      throw new UnauthenticatedError("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      throw error;
    }

    throw new UnauthenticatedError("Invalid or expired token");
  }
};

export const signAccessToken = (payload: Omit<AccessTokenPayload, "type">) => {
  return signToken(
    {
      ...payload,
      type: "access",
    },
    accessSecret,
    accessTtl
  );
};

export const signRefreshToken = (payload: Omit<RefreshTokenPayload, "type">) => {
  return signToken(
    {
      ...payload,
      type: "refresh",
    },
    refreshSecret,
    refreshTtl
  );
};

export const verifyAccessToken = (token: string) => {
  return verifyToken<AccessTokenPayload>(token, accessSecret, "access");
};

export const verifyRefreshToken = (token: string) => {
  return verifyToken<RefreshTokenPayload>(token, refreshSecret, "refresh");
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
