import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  CreateTeamMemberUseCase,
  DeleteTeamMemberUseCase,
  GetPublicTeamMemberBySlugUseCase,
  GetTeamMemberByIdUseCase,
  ListPublicTeamMembersUseCase,
  ListTeamMembersUseCase,
  UpdateTeamMemberUseCase,
  UpdateTeamMemberWorkflowUseCase,
} from "./use-cases/team-member.use-cases";

const listTeamMembersUseCase = new ListTeamMembersUseCase();
const getTeamMemberByIdUseCase = new GetTeamMemberByIdUseCase();
const createTeamMemberUseCase = new CreateTeamMemberUseCase();
const updateTeamMemberUseCase = new UpdateTeamMemberUseCase();
const deleteTeamMemberUseCase = new DeleteTeamMemberUseCase();
const updateTeamMemberWorkflowUseCase = new UpdateTeamMemberWorkflowUseCase();
const listPublicTeamMembersUseCase = new ListPublicTeamMembersUseCase();
const getPublicTeamMemberBySlugUseCase = new GetPublicTeamMemberBySlugUseCase();

const getId = (req: Request) => String(req.params.id);
const getSlug = (req: Request) => String(req.params.slug);

export const listTeamMembers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await listTeamMembersUseCase.execute();
    sendSuccess(res, 200, "Team members retrieved successfully", items);
  } catch (error) {
    next(error);
  }
};

export const getTeamMemberById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getTeamMemberByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Team member retrieved successfully", item);
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await createTeamMemberUseCase.execute(req.body);
    sendSuccess(res, 201, "Team member created successfully", item);
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await updateTeamMemberUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Team member updated successfully", item);
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteTeamMemberUseCase.execute(getId(req));
    sendSuccess(res, 200, "Team member deleted successfully");
  } catch (error) {
    next(error);
  }
};

const workflowHandler =
  (action: "submit_review" | "approve" | "publish" | "schedule" | "archive") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await updateTeamMemberWorkflowUseCase.execute(
        getId(req),
        action,
        req.body.publishedAt
      );
      sendSuccess(res, 200, "Team member workflow updated successfully", item);
    } catch (error) {
      next(error);
    }
  };

export const submitTeamMemberReview = workflowHandler("submit_review");
export const approveTeamMember = workflowHandler("approve");
export const publishTeamMember = workflowHandler("publish");
export const scheduleTeamMember = workflowHandler("schedule");
export const archiveTeamMember = workflowHandler("archive");

export const listPublicTeamMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const featured =
      typeof req.query.featured === "boolean" ? req.query.featured : undefined;
    const items = await listPublicTeamMembersUseCase.execute(featured);
    sendSuccess(res, 200, "Team members retrieved successfully", items);
  } catch (error) {
    next(error);
  }
};

export const getPublicTeamMemberBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getPublicTeamMemberBySlugUseCase.execute(getSlug(req));
    sendSuccess(res, 200, "Team member retrieved successfully", item);
  } catch (error) {
    next(error);
  }
};
