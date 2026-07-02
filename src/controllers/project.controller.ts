import { Request, Response, NextFunction } from "express";
import { PrismaProjectRepository } from "../repositories/prisma-project.repository";
import { GetProjectsUseCase } from "../use-cases/project/get-projects.use-case";
import { GetProjectBySlugUseCase } from "../use-cases/project/get-project-by-slug.use-case";
import { CreateProjectUseCase } from "../use-cases/project/create-project.use-case";
import { UpdateProjectUseCase } from "../use-cases/project/update-project.use-case";
import { DeleteProjectUseCase } from "../use-cases/project/delete-project.use-case";

const repository = new PrismaProjectRepository();
const getProjectsUseCase = new GetProjectsUseCase(repository);
const getProjectBySlugUseCase = new GetProjectBySlugUseCase(repository);
const createProjectUseCase = new CreateProjectUseCase(repository);
const updateProjectUseCase = new UpdateProjectUseCase(repository);
const deleteProjectUseCase = new DeleteProjectUseCase(repository);

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await getProjectsUseCase.execute();
    res.status(200).json({
      success: true,
      data: projects.map((p) => p.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== "string") {
      res.status(400).json({ success: false, message: "Valid slug parameter is required" });
      return;
    }

    const project = await getProjectBySlugUseCase.execute(slug);
    if (!project) {
      res.status(404).json({
        success: false,
        message: `Project with slug '${slug}' not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;

    const requiredFields = [
      "slug",
      "name",
      "client",
      "year",
      "category",
      "industry",
      "serviceType",
      "summary",
      "challenge",
      "objective",
      "solution",
      "outcome",
      "deliverables",
      "technologies",
      "thumbnailLabel",
      "thumbnailTone",
      "gallery",
    ];

    const errors: Record<string, string> = {};

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        errors[field] = `Field '${field}' is required`;
      }
    }

    if (body.deliverables !== undefined && !Array.isArray(body.deliverables)) {
      errors.deliverables = "deliverables must be an array of strings";
    }

    if (body.technologies !== undefined && !Array.isArray(body.technologies)) {
      errors.technologies = "technologies must be an array of strings";
    }

    if (body.gallery !== undefined && !Array.isArray(body.gallery)) {
      errors.gallery = "gallery must be an array of objects";
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    const project = await createProjectUseCase.execute({
      slug: body.slug,
      name: body.name,
      client: body.client,
      year: body.year,
      category: body.category,
      industry: body.industry,
      serviceType: body.serviceType,
      summary: body.summary,
      challenge: body.challenge,
      objective: body.objective,
      solution: body.solution,
      outcome: body.outcome,
      deliverables: body.deliverables,
      technologies: body.technologies,
      thumbnailLabel: body.thumbnailLabel,
      thumbnailTone: body.thumbnailTone,
      gallery: body.gallery,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project.toJSON(),
    });
  } catch (error: any) {
    if (error.message && error.message.includes("already exists")) {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!id || typeof id !== "string") {
      res.status(400).json({ success: false, message: "Valid Project ID parameter is required" });
      return;
    }

    const requiredFields = [
      "slug",
      "name",
      "client",
      "year",
      "category",
      "industry",
      "serviceType",
      "summary",
      "challenge",
      "objective",
      "solution",
      "outcome",
      "deliverables",
      "technologies",
      "thumbnailLabel",
      "thumbnailTone",
      "gallery",
    ];

    const errors: Record<string, string> = {};

    for (const field of requiredFields) {
      if (req.method === "PUT") {
        if (body[field] === undefined || body[field] === null || body[field] === "") {
          errors[field] = `Field '${field}' is required`;
        }
      } else if (req.method === "PATCH") {
        if (body[field] !== undefined && (body[field] === null || body[field] === "")) {
          errors[field] = `Field '${field}' cannot be empty`;
        }
      }
    }

    if (body.deliverables !== undefined && !Array.isArray(body.deliverables)) {
      errors.deliverables = "deliverables must be an array of strings";
    }

    if (body.technologies !== undefined && !Array.isArray(body.technologies)) {
      errors.technologies = "technologies must be an array of strings";
    }

    if (body.gallery !== undefined && !Array.isArray(body.gallery)) {
      errors.gallery = "gallery must be an array of objects";
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    const project = await updateProjectUseCase.execute(id, body);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project.toJSON(),
    });
  } catch (error: any) {
    if (error.message && error.message.includes("not found")) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error.message && error.message.includes("already exists")) {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      res.status(400).json({ success: false, message: "Valid Project ID parameter is required" });
      return;
    }

    await deleteProjectUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    if (error.message && error.message.includes("not found")) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};
