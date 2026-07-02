import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  CreateFaqCategoryUseCase,
  CreateFaqItemUseCase,
  DeleteFaqCategoryUseCase,
  DeleteFaqItemUseCase,
  GetFaqItemByIdUseCase,
  ListFaqCategoriesUseCase,
  ListFaqItemsUseCase,
  ListPublicFaqsUseCase,
  UpdateFaqCategoryUseCase,
  UpdateFaqItemUseCase,
  UpdateFaqItemWorkflowUseCase,
} from "./use-cases/faq.use-cases";

const listFaqCategoriesUseCase = new ListFaqCategoriesUseCase();
const createFaqCategoryUseCase = new CreateFaqCategoryUseCase();
const updateFaqCategoryUseCase = new UpdateFaqCategoryUseCase();
const deleteFaqCategoryUseCase = new DeleteFaqCategoryUseCase();
const listFaqItemsUseCase = new ListFaqItemsUseCase();
const getFaqItemByIdUseCase = new GetFaqItemByIdUseCase();
const createFaqItemUseCase = new CreateFaqItemUseCase();
const updateFaqItemUseCase = new UpdateFaqItemUseCase();
const deleteFaqItemUseCase = new DeleteFaqItemUseCase();
const updateFaqItemWorkflowUseCase = new UpdateFaqItemWorkflowUseCase();
const listPublicFaqsUseCase = new ListPublicFaqsUseCase();

const getId = (req: Request) => String(req.params.id);

export const listFaqCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await listFaqCategoriesUseCase.execute();
    sendSuccess(res, 200, "FAQ categories retrieved successfully", categories);
  } catch (error) {
    next(error);
  }
};

export const createFaqCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await createFaqCategoryUseCase.execute(req.body);
    sendSuccess(res, 201, "FAQ category created successfully", category);
  } catch (error) {
    next(error);
  }
};

export const updateFaqCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await updateFaqCategoryUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "FAQ category updated successfully", category);
  } catch (error) {
    next(error);
  }
};

export const deleteFaqCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteFaqCategoryUseCase.execute(getId(req));
    sendSuccess(res, 200, "FAQ category deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const listFaqItems = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await listFaqItemsUseCase.execute();
    sendSuccess(res, 200, "FAQ items retrieved successfully", items);
  } catch (error) {
    next(error);
  }
};

export const getFaqItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getFaqItemByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "FAQ item retrieved successfully", item);
  } catch (error) {
    next(error);
  }
};

export const createFaqItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await createFaqItemUseCase.execute(req.body);
    sendSuccess(res, 201, "FAQ item created successfully", item);
  } catch (error) {
    next(error);
  }
};

export const updateFaqItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await updateFaqItemUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "FAQ item updated successfully", item);
  } catch (error) {
    next(error);
  }
};

export const deleteFaqItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteFaqItemUseCase.execute(getId(req));
    sendSuccess(res, 200, "FAQ item deleted successfully");
  } catch (error) {
    next(error);
  }
};

const workflowHandler =
  (action: "submit_review" | "approve" | "publish" | "schedule" | "archive") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await updateFaqItemWorkflowUseCase.execute(
        getId(req),
        action,
        req.body.publishedAt
      );
      sendSuccess(res, 200, "FAQ item workflow updated successfully", item);
    } catch (error) {
      next(error);
    }
  };

export const submitFaqItemReview = workflowHandler("submit_review");
export const approveFaqItem = workflowHandler("approve");
export const publishFaqItem = workflowHandler("publish");
export const scheduleFaqItem = workflowHandler("schedule");
export const archiveFaqItem = workflowHandler("archive");

export const listPublicFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      ...(typeof req.query.categorySlug === "string" ? { categorySlug: req.query.categorySlug } : {}),
      ...(typeof req.query.featured === "boolean" ? { featured: req.query.featured } : {}),
    };
    const items = await listPublicFaqsUseCase.execute(filters);
    sendSuccess(res, 200, "FAQs retrieved successfully", items);
  } catch (error) {
    next(error);
  }
};
