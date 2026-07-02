import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { CreatePageUseCase } from "./use-cases/create-page.use-case";
import { DeletePageUseCase } from "./use-cases/delete-page.use-case";
import { GetPageByIdUseCase } from "./use-cases/get-page-by-id.use-case";
import { GetPublicPageBySlugUseCase } from "./use-cases/get-public-page-by-slug.use-case";
import { ListPagesUseCase } from "./use-cases/list-pages.use-case";
import { PublishPageUseCase } from "./use-cases/publish-page.use-case";
import { ReplacePageSectionsUseCase } from "./use-cases/replace-page-sections.use-case";
import { UpdatePageUseCase } from "./use-cases/update-page.use-case";

const listPagesUseCase = new ListPagesUseCase();
const getPageByIdUseCase = new GetPageByIdUseCase();
const createPageUseCase = new CreatePageUseCase();
const updatePageUseCase = new UpdatePageUseCase();
const deletePageUseCase = new DeletePageUseCase();
const replacePageSectionsUseCase = new ReplacePageSectionsUseCase();
const publishPageUseCase = new PublishPageUseCase();
const getPublicPageBySlugUseCase = new GetPublicPageBySlugUseCase();

const getId = (req: Request) => String(req.params.id);
const getSlug = (req: Request) => String(req.params.slug);

export const listPages = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await listPagesUseCase.execute();
    sendSuccess(res, 200, "Pages retrieved successfully", pages);
  } catch (error) {
    next(error);
  }
};

export const getPageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await getPageByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Page retrieved successfully", page);
  } catch (error) {
    next(error);
  }
};

export const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await createPageUseCase.execute(req.body);
    sendSuccess(res, 201, "Page created successfully", page);
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await updatePageUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Page updated successfully", page);
  } catch (error) {
    next(error);
  }
};

export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deletePageUseCase.execute(getId(req));
    sendSuccess(res, 200, "Page deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const replacePageSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await replacePageSectionsUseCase.execute(getId(req), req.body.sections);
    sendSuccess(res, 200, "Page sections updated successfully", page);
  } catch (error) {
    next(error);
  }
};

export const publishPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await publishPageUseCase.execute(getId(req), req.body.isPublished);
    sendSuccess(res, 200, "Page publish status updated successfully", page);
  } catch (error) {
    next(error);
  }
};

export const getPublicPageBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await getPublicPageBySlugUseCase.execute(getSlug(req));
    sendSuccess(res, 200, "Page retrieved successfully", page);
  } catch (error) {
    next(error);
  }
};
