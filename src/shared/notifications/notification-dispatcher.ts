import prisma from "../../config/prisma";

const db = prisma as any;

const withTimeout = async (url: string, options: RequestInit, timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

export const dispatchNotification = async (event: string, payload: Record<string, unknown>) => {
  const settings = await db.notificationSetting.findMany({
    where: {
      event,
      isEnabled: true,
    },
  });

  const results: Array<{ channel: string; success: boolean; error?: string }> = [];

  for (const setting of settings) {
    try {
      if (setting.channel === "webhook") {
        const config = (setting.config || {}) as { url?: string; secret?: string };
        if (config.url) {
          const response = await withTimeout(
            config.url,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(config.secret ? { "X-Webhook-Secret": config.secret } : {}),
              },
              body: JSON.stringify({
                event,
                payload,
              }),
            },
            Number(process.env.NOTIFICATION_WEBHOOK_TIMEOUT_MS || 5000)
          );

          if (!response.ok) {
            throw new Error(`Webhook responded with status ${response.status}`);
          }
        }
      } else if (setting.channel === "email") {
        console.log("Notification email stub", {
          event,
          payload,
          config: setting.config,
        });
      }

      results.push({ channel: setting.channel, success: true });
    } catch (error: any) {
      console.error("Notification dispatch failed", error);
      results.push({
        channel: setting.channel,
        success: false,
        error: error?.message || "Unknown notification error",
      });
    }
  }

  return results;
};
