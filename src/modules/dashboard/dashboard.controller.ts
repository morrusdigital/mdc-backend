import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { GetDashboardSummaryUseCase } from "./use-cases/get-dashboard-summary.use-case";

const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase();

export const getDashboardSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await getDashboardSummaryUseCase.execute();
    sendSuccess(res, 200, "Dashboard summary retrieved successfully", summary);
  } catch (error) {
    next(error);
  }
};
