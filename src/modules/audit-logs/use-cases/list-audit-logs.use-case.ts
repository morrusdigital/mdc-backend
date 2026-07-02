import prisma from "../../../config/prisma";

export class ListAuditLogsUseCase {
  async execute(filters: { module?: string; actorId?: number; limit?: number }) {
    const db = prisma as any;
    const logs = await db.auditLog.findMany({
      where: {
        ...(filters.module && { module: filters.module }),
        ...(filters.actorId && { actorId: filters.actorId }),
      },
      include: {
        actor: true,
      },
      orderBy: [{ createdAt: "desc" }],
      take: filters.limit ?? 20,
    });

    return logs.map((log: any) => ({
      id: log.id,
      module: log.module,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      summary: log.summary,
      payload: log.payload,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
      actor: log.actor
        ? {
            id: log.actor.id,
            email: log.actor.email,
            name: log.actor.name,
          }
        : null,
    }));
  }
}
