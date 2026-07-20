import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  CreateBlogPostUseCase,
  DeleteBlogPostUseCase,
  GetBlogPostByIdUseCase,
  GetPublicBlogPostBySlugUseCase,
  ListBlogPostsUseCase,
  ListPublicBlogPostsUseCase,
  UpdateBlogPostUseCase,
  UpdateBlogPostWorkflowUseCase,
} from "./use-cases/blog-post.use-cases";
import {
  CreateBlogCategoryUseCase,
  CreateTagUseCase,
  DeleteBlogCategoryUseCase,
  DeleteTagUseCase,
  ListBlogCategoriesUseCase,
  ListTagsUseCase,
  UpdateBlogCategoryUseCase,
  UpdateTagUseCase,
} from "./use-cases/blog-taxonomy.use-cases";

const listBlogPostsUseCase = new ListBlogPostsUseCase();
const getBlogPostByIdUseCase = new GetBlogPostByIdUseCase();
const createBlogPostUseCase = new CreateBlogPostUseCase();
const updateBlogPostUseCase = new UpdateBlogPostUseCase();
const deleteBlogPostUseCase = new DeleteBlogPostUseCase();
const updateBlogPostWorkflowUseCase = new UpdateBlogPostWorkflowUseCase();
const listPublicBlogPostsUseCase = new ListPublicBlogPostsUseCase();
const getPublicBlogPostBySlugUseCase = new GetPublicBlogPostBySlugUseCase();
const listBlogCategoriesUseCase = new ListBlogCategoriesUseCase();
const createBlogCategoryUseCase = new CreateBlogCategoryUseCase();
const updateBlogCategoryUseCase = new UpdateBlogCategoryUseCase();
const deleteBlogCategoryUseCase = new DeleteBlogCategoryUseCase();
const listTagsUseCase = new ListTagsUseCase();
const createTagUseCase = new CreateTagUseCase();
const updateTagUseCase = new UpdateTagUseCase();
const deleteTagUseCase = new DeleteTagUseCase();

const getId = (req: Request) => String(req.params.id);
const getSlug = (req: Request) => String(req.params.slug);

export const listBlogPosts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await listBlogPostsUseCase.execute();
    sendSuccess(res, 200, "Blog posts retrieved successfully", posts);
  } catch (error) {
    next(error);
  }
};

export const getBlogPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await getBlogPostByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Blog post retrieved successfully", post);
  } catch (error) {
    next(error);
  }
};

export const createBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await createBlogPostUseCase.execute(req.body);
    sendSuccess(res, 201, "Blog post created successfully", post);
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await updateBlogPostUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Blog post updated successfully", post);
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteBlogPostUseCase.execute(getId(req));
    sendSuccess(res, 200, "Blog post deleted successfully");
  } catch (error) {
    next(error);
  }
};

const workflowHandler =
  (action: "submit_review" | "approve" | "publish" | "schedule" | "archive") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await updateBlogPostWorkflowUseCase.execute(
        getId(req),
        action,
        req.body?.publishedAt
      );
      sendSuccess(res, 200, "Blog post workflow updated successfully", post);
    } catch (error) {
      next(error);
    }
  };

export const submitBlogPostReview = workflowHandler("submit_review");
export const approveBlogPost = workflowHandler("approve");
export const publishBlogPost = workflowHandler("publish");
export const scheduleBlogPost = workflowHandler("schedule");
export const archiveBlogPost = workflowHandler("archive");

export const listPublicBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      ...(typeof req.query.categorySlug === "string" ? { categorySlug: req.query.categorySlug } : {}),
      ...(typeof req.query.tagSlug === "string" ? { tagSlug: req.query.tagSlug } : {}),
      ...(typeof req.query.featured === "boolean" ? { featured: req.query.featured } : {}),
    };
    const posts = await listPublicBlogPostsUseCase.execute(filters);
    sendSuccess(res, 200, "Blog posts retrieved successfully", posts);
  } catch (error) {
    next(error);
  }
};

export const getPublicBlogPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPublicBlogPostBySlugUseCase.execute(getSlug(req));
    sendSuccess(res, 200, "Blog post retrieved successfully", post);
  } catch (error) {
    next(error);
  }
};

export const listBlogCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await listBlogCategoriesUseCase.execute();
    sendSuccess(res, 200, "Blog categories retrieved successfully", categories);
  } catch (error) {
    next(error);
  }
};

export const createBlogCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await createBlogCategoryUseCase.execute(req.body);
    sendSuccess(res, 201, "Blog category created successfully", category);
  } catch (error) {
    next(error);
  }
};

export const updateBlogCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await updateBlogCategoryUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Blog category updated successfully", category);
  } catch (error) {
    next(error);
  }
};

export const deleteBlogCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteBlogCategoryUseCase.execute(getId(req));
    sendSuccess(res, 200, "Blog category deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const listTags = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await listTagsUseCase.execute();
    sendSuccess(res, 200, "Tags retrieved successfully", tags);
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag = await createTagUseCase.execute(req.body);
    sendSuccess(res, 201, "Tag created successfully", tag);
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag = await updateTagUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Tag updated successfully", tag);
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteTagUseCase.execute(getId(req));
    sendSuccess(res, 200, "Tag deleted successfully");
  } catch (error) {
    next(error);
  }
};
