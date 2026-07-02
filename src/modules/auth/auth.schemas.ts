import { z } from "zod";

export const loginSchema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
};

export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(1),
  }),
};
