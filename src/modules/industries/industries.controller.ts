import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import * as useCases from "./industries.use-cases";

const handle = (fn: (req: Request) => Promise<unknown>, message: string, status = 200) => async (req: Request, res: Response, next: NextFunction) => { try { sendSuccess(res, status, message, await fn(req)); } catch (error) { next(error); } };
export const listIndustries = handle(() => useCases.listIndustries(), "Industries retrieved successfully");
export const listPublicIndustries = handle(() => useCases.listIndustries(true), "Industries retrieved successfully");
export const getPublicIndustry = handle((req) => useCases.getPublicIndustry(String(req.params.slug)), "Industry retrieved successfully");
export const createIndustry = handle((req) => useCases.createIndustry(req.body), "Industry created successfully", 201);
export const updateIndustry = handle((req) => useCases.updateIndustry(String(req.params.id), req.body), "Industry updated successfully");
export const deleteIndustry = handle(async (req) => { await useCases.deleteIndustry(String(req.params.id)); return undefined; }, "Industry deleted successfully");
export const createSolution = handle((req) => useCases.createSolution(String(req.params.industryId), req.body), "Solution created successfully", 201);
export const updateSolution = handle((req) => useCases.updateSolution(String(req.params.industryId), String(req.params.solutionId), req.body), "Solution updated successfully");
export const deleteSolution = handle(async (req) => { await useCases.deleteSolution(String(req.params.industryId), String(req.params.solutionId)); return undefined; }, "Solution deleted successfully");
