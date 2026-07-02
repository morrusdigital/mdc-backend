import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { CreateServiceCategoryUseCase } from "./use-cases/create-service-category.use-case";
import { CreateServiceUseCase } from "./use-cases/create-service.use-case";
import { DeleteServiceCategoryUseCase } from "./use-cases/delete-service-category.use-case";
import { DeleteServiceUseCase } from "./use-cases/delete-service.use-case";
import { GetPublicServiceBySlugUseCase } from "./use-cases/get-public-service-by-slug.use-case";
import { GetServiceByIdUseCase } from "./use-cases/get-service-by-id.use-case";
import { ListPublicServicesUseCase } from "./use-cases/list-public-services.use-case";
import { ListServiceCategoriesUseCase } from "./use-cases/list-service-categories.use-case";
import { ListServicesUseCase } from "./use-cases/list-services.use-case";
import { UpdateServiceCategoryUseCase } from "./use-cases/update-service-category.use-case";
import { UpdateServiceUseCase } from "./use-cases/update-service.use-case";

const listServiceCategoriesUseCase = new ListServiceCategoriesUseCase();
const createServiceCategoryUseCase = new CreateServiceCategoryUseCase();
const updateServiceCategoryUseCase = new UpdateServiceCategoryUseCase();
const deleteServiceCategoryUseCase = new DeleteServiceCategoryUseCase();
const listServicesUseCase = new ListServicesUseCase();
const getServiceByIdUseCase = new GetServiceByIdUseCase();
const createServiceUseCase = new CreateServiceUseCase();
const updateServiceUseCase = new UpdateServiceUseCase();
const deleteServiceUseCase = new DeleteServiceUseCase();
const listPublicServicesUseCase = new ListPublicServicesUseCase();
const getPublicServiceBySlugUseCase = new GetPublicServiceBySlugUseCase();

const getId = (req: Request) => String(req.params.id);
const getSlug = (req: Request) => String(req.params.slug);

export const listServiceCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await listServiceCategoriesUseCase.execute();
    sendSuccess(res, 200, "Service categories retrieved successfully", categories);
  } catch (error) {
    next(error);
  }
};

export const createServiceCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await createServiceCategoryUseCase.execute(req.body);
    sendSuccess(res, 201, "Service category created successfully", category);
  } catch (error) {
    next(error);
  }
};

export const updateServiceCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await updateServiceCategoryUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Service category updated successfully", category);
  } catch (error) {
    next(error);
  }
};

export const deleteServiceCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteServiceCategoryUseCase.execute(getId(req));
    sendSuccess(res, 200, "Service category deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const listServices = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await listServicesUseCase.execute();
    sendSuccess(res, 200, "Services retrieved successfully", services);
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await getServiceByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Service retrieved successfully", service);
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await createServiceUseCase.execute(req.body);
    sendSuccess(res, 201, "Service created successfully", service);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await updateServiceUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Service updated successfully", service);
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteServiceUseCase.execute(getId(req));
    sendSuccess(res, 200, "Service deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const listPublicServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      ...(typeof req.query.categorySlug === "string" ? { categorySlug: req.query.categorySlug } : {}),
      ...(typeof req.query.featured === "boolean" ? { featured: req.query.featured } : {}),
    };
    const services = await listPublicServicesUseCase.execute(filters);
    sendSuccess(res, 200, "Services retrieved successfully", services);
  } catch (error) {
    next(error);
  }
};

export const getPublicServiceBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await getPublicServiceBySlugUseCase.execute(getSlug(req));
    sendSuccess(res, 200, "Service retrieved successfully", service);
  } catch (error) {
    next(error);
  }
};
