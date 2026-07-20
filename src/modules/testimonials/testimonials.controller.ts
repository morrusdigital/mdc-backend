import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  CreateTestimonialUseCase,
  DeleteTestimonialUseCase,
  GetTestimonialByIdUseCase,
  ListPublicTestimonialsUseCase,
  ListTestimonialsUseCase,
  UpdateTestimonialUseCase,
  UpdateTestimonialWorkflowUseCase,
} from "./use-cases/testimonial.use-cases";

const listTestimonialsUseCase = new ListTestimonialsUseCase();
const getTestimonialByIdUseCase = new GetTestimonialByIdUseCase();
const createTestimonialUseCase = new CreateTestimonialUseCase();
const updateTestimonialUseCase = new UpdateTestimonialUseCase();
const deleteTestimonialUseCase = new DeleteTestimonialUseCase();
const updateTestimonialWorkflowUseCase = new UpdateTestimonialWorkflowUseCase();
const listPublicTestimonialsUseCase = new ListPublicTestimonialsUseCase();

const getId = (req: Request) => String(req.params.id);

export const listTestimonials = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await listTestimonialsUseCase.execute();
    sendSuccess(res, 200, "Testimonials retrieved successfully", items);
  } catch (error) {
    next(error);
  }
};

export const getTestimonialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getTestimonialByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Testimonial retrieved successfully", item);
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await createTestimonialUseCase.execute(req.body);
    sendSuccess(res, 201, "Testimonial created successfully", item);
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await updateTestimonialUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Testimonial updated successfully", item);
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteTestimonialUseCase.execute(getId(req));
    sendSuccess(res, 200, "Testimonial deleted successfully");
  } catch (error) {
    next(error);
  }
};

const workflowHandler =
  (action: "submit_review" | "approve" | "publish" | "schedule" | "archive") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await updateTestimonialWorkflowUseCase.execute(
        getId(req),
        action,
        req.body?.publishedAt
      );
      sendSuccess(res, 200, "Testimonial workflow updated successfully", item);
    } catch (error) {
      next(error);
    }
  };

export const submitTestimonialReview = workflowHandler("submit_review");
export const approveTestimonial = workflowHandler("approve");
export const publishTestimonial = workflowHandler("publish");
export const scheduleTestimonial = workflowHandler("schedule");
export const archiveTestimonial = workflowHandler("archive");

export const listPublicTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const featured =
      typeof req.query.featured === "boolean" ? req.query.featured : undefined;
    const items = await listPublicTestimonialsUseCase.execute(featured);
    sendSuccess(res, 200, "Testimonials retrieved successfully", items);
  } catch (error) {
    next(error);
  }
};
