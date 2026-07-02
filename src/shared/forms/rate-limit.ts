import { ForbiddenError } from "../errors/app-error";

type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, Bucket>();

export const enforcePublicFormRateLimit = (ipKey: string) => {
  const now = Date.now();
  const windowMs = Number(process.env.FORMS_RATE_LIMIT_WINDOW_MS || 60000);
  const max = Number(process.env.FORMS_RATE_LIMIT_MAX || 10);
  const existing = buckets.get(ipKey);

  if (!existing || existing.expiresAt <= now) {
    buckets.set(ipKey, {
      count: 1,
      expiresAt: now + windowMs,
    });
    return;
  }

  if (existing.count >= max) {
    throw new ForbiddenError("Rate limit exceeded for public form submissions");
  }

  existing.count += 1;
  buckets.set(ipKey, existing);
};

export const assertHoneypotClear = (value?: string) => {
  if (value && value.trim().length > 0) {
    throw new ForbiddenError("Spam submission detected");
  }
};
