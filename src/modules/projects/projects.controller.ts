import { NextFunction, Request, Response } from "express";
import { PrismaProjectRepository } from "./repositories/prisma-project.repository";
import { CreateProjectUseCase } from "./use-cases/create-project.use-case";
import { DeleteProjectUseCase } from "./use-cases/delete-project.use-case";
import { GetProjectBySlugUseCase } from "./use-cases/get-project-by-slug.use-case";
import { GetProjectsUseCase } from "./use-cases/get-projects.use-case";
import { UpdateProjectUseCase } from "./use-cases/update-project.use-case";
import { sendSuccess } from "../../shared/http/response";

const repository = new PrismaProjectRepository();
const getProjectsUseCase = new GetProjectsUseCase(repository);
const getProjectBySlugUseCase = new GetProjectBySlugUseCase(repository);
const createProjectUseCase = new CreateProjectUseCase(repository);
const updateProjectUseCase = new UpdateProjectUseCase(repository);
const deleteProjectUseCase = new DeleteProjectUseCase(repository);
const getStringParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const listProjects = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await getProjectsUseCase.execute();
    sendSuccess(
      res,
      200,
      "Projects retrieved successfully",
      projects.map((project) => project.toJSON())
    );
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await getProjectBySlugUseCase.execute(
      getStringParam(req.params.slug)
    );
    sendSuccess(res, 200, "Project retrieved successfully", project.toJSON());
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await createProjectUseCase.execute(req.body);
    sendSuccess(res, 201, "Project created successfully", project.toJSON());
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await updateProjectUseCase.execute(
      getStringParam(req.params.id),
      req.body
    );
    sendSuccess(res, 200, "Project updated successfully", project.toJSON());
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteProjectUseCase.execute(getStringParam(req.params.id));
    sendSuccess(res, 200, "Project deleted successfully");
  } catch (error) {
    next(error);
  }
};
