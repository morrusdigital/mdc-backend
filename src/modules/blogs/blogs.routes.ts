import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  approveBlogPost,
  archiveBlogPost,
  createBlogCategory,
  createBlogPost,
  createTag,
  deleteBlogCategory,
  deleteBlogPost,
  deleteTag,
  getBlogPostById,
  getPublicBlogPostBySlug,
  listBlogCategories,
  listBlogPosts,
  listPublicBlogPosts,
  listTags,
  publishBlogPost,
  scheduleBlogPost,
  submitBlogPostReview,
  updateBlogCategory,
  updateBlogPost,
  updateTag,
} from "./blogs.controller";
import {
  blogCategoryIdParamsSchema,
  blogPostIdParamsSchema,
  blogPostSlugParamsSchema,
  createBlogCategorySchema,
  createBlogPostSchema,
  createTagSchema,
  publicBlogPostsQuerySchema,
  scheduleBlogPostSchema,
  tagIdParamsSchema,
  updateBlogCategorySchema,
  updateBlogPostSchema,
  updateTagSchema,
  updateWorkflowParamsSchema,
} from "./blogs.schemas";

const adminRouter = Router();
const publicRouter = Router();

adminRouter.use(requireAuth());

adminRouter.get("/blog-posts", requirePermission("blog_posts.read"), listBlogPosts);
adminRouter.get(
  "/blog-posts/:id",
  requirePermission("blog_posts.read"),
  validateRequest(blogPostIdParamsSchema),
  getBlogPostById
);
adminRouter.post(
  "/blog-posts",
  requirePermission("blog_posts.create"),
  validateRequest(createBlogPostSchema),
  createBlogPost
);
adminRouter.patch(
  "/blog-posts/:id",
  requirePermission("blog_posts.update"),
  validateRequest(updateBlogPostSchema),
  updateBlogPost
);
adminRouter.delete(
  "/blog-posts/:id",
  requirePermission("blog_posts.delete"),
  validateRequest(blogPostIdParamsSchema),
  deleteBlogPost
);
adminRouter.post(
  "/blog-posts/:id/submit-review",
  requirePermission("blog_posts.submit_review"),
  validateRequest(updateWorkflowParamsSchema),
  submitBlogPostReview
);
adminRouter.post(
  "/blog-posts/:id/approve",
  requirePermission("blog_posts.approve"),
  validateRequest(updateWorkflowParamsSchema),
  approveBlogPost
);
adminRouter.post(
  "/blog-posts/:id/publish",
  requirePermission("blog_posts.publish"),
  validateRequest(updateWorkflowParamsSchema),
  publishBlogPost
);
adminRouter.post(
  "/blog-posts/:id/schedule",
  requirePermission("blog_posts.publish"),
  validateRequest(scheduleBlogPostSchema),
  scheduleBlogPost
);
adminRouter.post(
  "/blog-posts/:id/archive",
  requirePermission("blog_posts.archive"),
  validateRequest(updateWorkflowParamsSchema),
  archiveBlogPost
);

adminRouter.get("/blog-categories", requirePermission("blog_categories.read"), listBlogCategories);
adminRouter.post(
  "/blog-categories",
  requirePermission("blog_categories.create"),
  validateRequest(createBlogCategorySchema),
  createBlogCategory
);
adminRouter.patch(
  "/blog-categories/:id",
  requirePermission("blog_categories.update"),
  validateRequest(updateBlogCategorySchema),
  updateBlogCategory
);
adminRouter.delete(
  "/blog-categories/:id",
  requirePermission("blog_categories.delete"),
  validateRequest(blogCategoryIdParamsSchema),
  deleteBlogCategory
);

adminRouter.get("/tags", requirePermission("tags.read"), listTags);
adminRouter.post(
  "/tags",
  requirePermission("tags.create"),
  validateRequest(createTagSchema),
  createTag
);
adminRouter.patch(
  "/tags/:id",
  requirePermission("tags.update"),
  validateRequest(updateTagSchema),
  updateTag
);
adminRouter.delete(
  "/tags/:id",
  requirePermission("tags.delete"),
  validateRequest(tagIdParamsSchema),
  deleteTag
);

publicRouter.get("/blog-posts", validateRequest(publicBlogPostsQuerySchema), listPublicBlogPosts);
publicRouter.get(
  "/blog-posts/:slug",
  validateRequest(blogPostSlugParamsSchema),
  getPublicBlogPostBySlug
);
publicRouter.get("/blog-categories", listBlogCategories);

export { adminRouter as blogsAdminRoutes, publicRouter as blogsPublicRoutes };
