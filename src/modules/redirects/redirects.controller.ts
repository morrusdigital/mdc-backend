import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  CreateRedirectRuleUseCase,
  DeleteRedirectRuleUseCase,
  GetRedirectRuleByIdUseCase,
  ListRedirectRulesUseCase,
  ResolveRedirectUseCase,
  UpdateRedirectRuleUseCase,
} from "./use-cases/redirects.use-cases";

const listRedirectRulesUseCase = new ListRedirectRulesUseCase();
const getRedirectRuleByIdUseCase = new GetRedirectRuleByIdUseCase();
const createRedirectRuleUseCase = new CreateRedirectRuleUseCase();
const updateRedirectRuleUseCase = new UpdateRedirectRuleUseCase();
const deleteRedirectRuleUseCase = new DeleteRedirectRuleUseCase();
const resolveRedirectUseCase = new ResolveRedirectUseCase();

const getId = (req: Request) => String(req.params.id);

export const listRedirectRules = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await listRedirectRulesUseCase.execute();
    sendSuccess(res, 200, "Redirect rules retrieved successfully", rules);
  } catch (error) {
    next(error);
  }
};

export const getRedirectRuleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rule = await getRedirectRuleByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Redirect rule retrieved successfully", rule);
  } catch (error) {
    next(error);
  }
};

export const createRedirectRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rule = await createRedirectRuleUseCase.execute(req.body);
    sendSuccess(res, 201, "Redirect rule created successfully", rule);
  } catch (error) {
    next(error);
  }
};

export const updateRedirectRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rule = await updateRedirectRuleUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Redirect rule updated successfully", rule);
  } catch (error) {
    next(error);
  }
};

export const deleteRedirectRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteRedirectRuleUseCase.execute(getId(req));
    sendSuccess(res, 200, "Redirect rule deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const resolveRedirect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = typeof req.query.path === "string" ? req.query.path : "";
    const result = await resolveRedirectUseCase.execute(path);
    sendSuccess(res, 200, "Redirect resolution completed", result);
  } catch (error) {
    next(error);
  }
};
