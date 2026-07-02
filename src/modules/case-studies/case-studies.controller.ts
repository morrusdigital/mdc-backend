import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  CreateCaseStudyUseCase,
  DeleteCaseStudyUseCase,
  GetCaseStudyByIdUseCase,
  GetPublicCaseStudyBySlugUseCase,
  ListCaseStudiesUseCase,
  ListPublicCaseStudiesUseCase,
  UpdateCaseStudyUseCase,
  UpdateCaseStudyWorkflowUseCase,
} from "./use-cases/case-study.use-cases";

const listCaseStudiesUseCase = new ListCaseStudiesUseCase();
const getCaseStudyByIdUseCase = new GetCaseStudyByIdUseCase();
const createCaseStudyUseCase = new CreateCaseStudyUseCase();
const updateCaseStudyUseCase = new UpdateCaseStudyUseCase();
const deleteCaseStudyUseCase = new DeleteCaseStudyUseCase();
const updateCaseStudyWorkflowUseCase = new UpdateCaseStudyWorkflowUseCase();
const listPublicCaseStudiesUseCase = new ListPublicCaseStudiesUseCase();
const getPublicCaseStudyBySlugUseCase = new GetPublicCaseStudyBySlugUseCase();

const getId = (req: Request) => String(req.params.id);
const getSlug = (req: Request) => String(req.params.slug);

export const listCaseStudies = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await listCaseStudiesUseCase.execute();
    sendSuccess(res, 200, "Case studies retrieved successfully", items);
  } catch (error) {
    next(error);
  }
};

export const getCaseStudyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getCaseStudyByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Case study retrieved successfully", item);
  } catch (error) {
    next(error);
  }
};

export const createCaseStudy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await createCaseStudyUseCase.execute(req.body);
    sendSuccess(res, 201, "Case study created successfully", item);
  } catch (error) {
    next(error);
  }
};

export const updateCaseStudy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await updateCaseStudyUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Case study updated successfully", item);
  } catch (error) {
    next(error);
  }
};

export const deleteCaseStudy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteCaseStudyUseCase.execute(getId(req));
    sendSuccess(res, 200, "Case study deleted successfully");
  } catch (error) {
    next(error);
  }
};

const workflowHandler =
  (action: "submit_review" | "approve" | "publish" | "schedule" | "archive") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await updateCaseStudyWorkflowUseCase.execute(
        getId(req),
        action,
        req.body.publishedAt
      );
      sendSuccess(res, 200, "Case study workflow updated successfully", item);
    } catch (error) {
      next(error);
    }
  };

export const submitCaseStudyReview = workflowHandler("submit_review");
export const approveCaseStudy = workflowHandler("approve");
export const publishCaseStudy = workflowHandler("publish");
export const scheduleCaseStudy = workflowHandler("schedule");
export const archiveCaseStudy = workflowHandler("archive");

export const listPublicCaseStudies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const featured =
      typeof req.query.featured === "boolean" ? req.query.featured : undefined;
    const items = await listPublicCaseStudiesUseCase.execute(featured);
    sendSuccess(res, 200, "Case studies retrieved successfully", items);
  } catch (error) {
    next(error);
  }
};

export const getPublicCaseStudyBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getPublicCaseStudyBySlugUseCase.execute(getSlug(req));
    sendSuccess(res, 200, "Case study retrieved successfully", item);
  } catch (error) {
    next(error);
  }
};
