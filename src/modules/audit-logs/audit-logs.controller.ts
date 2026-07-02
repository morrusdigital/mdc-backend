import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { ListAuditLogsUseCase } from "./use-cases/list-audit-logs.use-case";

const listAuditLogsUseCase = new ListAuditLogsUseCase();

export const listAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await listAuditLogsUseCase.execute({
      ...(typeof req.query.module === "string" ? { module: req.query.module } : {}),
      ...(typeof req.query.actorId === "number" ? { actorId: req.query.actorId } : {}),
      ...(typeof req.query.limit === "number" ? { limit: req.query.limit } : {}),
    });
    sendSuccess(res, 200, "Audit logs retrieved successfully", logs);
  } catch (error) {
    next(error);
  }
};
