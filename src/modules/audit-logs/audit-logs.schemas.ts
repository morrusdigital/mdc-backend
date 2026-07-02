import { z } from "zod";

export const listAuditLogsQuerySchema = {
  query: z.object({
    module: z.string().min(1).optional(),
    actorId: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
};
