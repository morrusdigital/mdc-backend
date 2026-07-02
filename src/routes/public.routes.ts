import { Router } from "express";
import { validateRequest } from "../shared/validation/validate";
import {
  getProjectBySlug,
  listProjects,
} from "../modules/projects/projects.controller";
import { projectSlugParamsSchema } from "../modules/projects/projects.schemas";
import { getPublicPageBySlug } from "../modules/pages/pages.controller";
import { pageSlugParamsSchema } from "../modules/pages/pages.schemas";
import {
  getPublicServiceBySlug,
  listPublicServices,
} from "../modules/services/services.controller";
import {
  publicServicesQuerySchema,
  serviceSlugParamsSchema,
} from "../modules/services/services.schemas";
import { getPublicNavigationByCode } from "../modules/navigation/navigation.controller";
import { navigationCodeParamsSchema } from "../modules/navigation/navigation.schemas";
import { getSettingsGroup } from "../modules/settings/settings.controller";
import { settingsGroupParamsSchema } from "../modules/settings/settings.schemas";
import {
  getPublicBlogPostBySlug,
  listBlogCategories,
  listPublicBlogPosts,
} from "../modules/blogs/blogs.controller";
import {
  blogPostSlugParamsSchema,
  publicBlogPostsQuerySchema,
} from "../modules/blogs/blogs.schemas";
import {
  getPublicCaseStudyBySlug,
  listPublicCaseStudies,
} from "../modules/case-studies/case-studies.controller";
import {
  caseStudySlugParamsSchema,
  publicCaseStudiesQuerySchema,
} from "../modules/case-studies/case-studies.schemas";
import { listPublicTestimonials } from "../modules/testimonials/testimonials.controller";
import { publicTestimonialsQuerySchema } from "../modules/testimonials/testimonials.schemas";
import {
  getPublicTeamMemberBySlug,
  listPublicTeamMembers,
} from "../modules/team/team.controller";
import {
  publicTeamMembersQuerySchema,
  teamMemberSlugParamsSchema,
} from "../modules/team/team.schemas";
import { listPublicFaqs } from "../modules/faqs/faqs.controller";
import { publicFaqsQuerySchema } from "../modules/faqs/faqs.schemas";

const router = Router();

router.get("/portfolio", listProjects);
router.get(
  "/portfolio/:slug",
  validateRequest(projectSlugParamsSchema),
  getProjectBySlug
);
router.get(
  "/pages/:slug",
  validateRequest(pageSlugParamsSchema),
  getPublicPageBySlug
);
router.get(
  "/services",
  validateRequest(publicServicesQuerySchema),
  listPublicServices
);
router.get(
  "/services/:slug",
  validateRequest(serviceSlugParamsSchema),
  getPublicServiceBySlug
);
router.get(
  "/navigation/:code",
  validateRequest(navigationCodeParamsSchema),
  getPublicNavigationByCode
);
router.get(
  "/settings/:group",
  validateRequest(settingsGroupParamsSchema),
  getSettingsGroup
);
router.get(
  "/blog-posts",
  validateRequest(publicBlogPostsQuerySchema),
  listPublicBlogPosts
);
router.get(
  "/blog-posts/:slug",
  validateRequest(blogPostSlugParamsSchema),
  getPublicBlogPostBySlug
);
router.get("/blog-categories", listBlogCategories);
router.get(
  "/case-studies",
  validateRequest(publicCaseStudiesQuerySchema),
  listPublicCaseStudies
);
router.get(
  "/case-studies/:slug",
  validateRequest(caseStudySlugParamsSchema),
  getPublicCaseStudyBySlug
);
router.get(
  "/testimonials",
  validateRequest(publicTestimonialsQuerySchema),
  listPublicTestimonials
);
router.get(
  "/team-members",
  validateRequest(publicTeamMembersQuerySchema),
  listPublicTeamMembers
);
router.get(
  "/team-members/:slug",
  validateRequest(teamMemberSlugParamsSchema),
  getPublicTeamMemberBySlug
);
router.get("/faqs", validateRequest(publicFaqsQuerySchema), listPublicFaqs);

export default router;
