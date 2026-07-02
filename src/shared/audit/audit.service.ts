import prisma from "../../config/prisma";

const db = prisma as any;

export const recordAuditLog = async (input: {
  actorId?: number | undefined;
  module: string;
  action: string;
  entityType: string;
  entityId?: string | undefined;
  summary: string;
  payload?: unknown;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}) => {
  return db.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      module: input.module,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      summary: input.summary,
      payload: input.payload as any,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
};
