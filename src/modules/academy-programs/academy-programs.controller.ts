import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prisma";
import { ConflictError, NotFoundError } from "../../shared/errors/app-error";
import { sendSuccess } from "../../shared/http/response";
import {
  mapAcademyProgram,
  mapPublicAcademyProgram,
  mapPublicAcademyTrack,
} from "./academy-programs.helpers";

const getId = (req: Request) => String(req.params.id);
const getSlug = (req: Request) => String(req.params.slug);

export const listAcademyPrograms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const programs = await prisma.academyProgram.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    sendSuccess(res, 200, "Academy programs retrieved successfully", programs.map(mapAcademyProgram));
  } catch (error) {
    next(error);
  }
};

export const getAcademyProgramById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const program = await prisma.academyProgram.findUnique({ where: { id: getId(req) } });

    if (!program) {
      throw new NotFoundError("Academy program not found");
    }

    sendSuccess(res, 200, "Academy program retrieved successfully", mapAcademyProgram(program));
  } catch (error) {
    next(error);
  }
};

export const createAcademyProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body;
    const existing = await prisma.academyProgram.findUnique({ where: { slug: input.slug } });

    if (existing) {
      throw new ConflictError("Academy program slug is already in use");
    }

    const program = await prisma.academyProgram.create({
      data: {
        slug: input.slug,
        title: input.title,
        shortTitle: input.shortTitle,
        priceFrom: input.priceFrom,
        duration: input.duration,
        format: input.format,
        audience: input.audience,
        image: input.image,
        description: input.description,
        overview: input.overview,
        highlights: input.highlights,
        tracks: input.tracks,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        seoKeywords: input.seoKeywords,
        canonicalUrl: input.canonicalUrl ?? null,
        ogImageUrl: input.ogImageUrl ?? null,
        featured: input.featured ?? false,
        sortOrder: input.sortOrder ?? 0,
        isPublished: input.isPublished ?? false,
      },
    });

    sendSuccess(res, 201, "Academy program created successfully", mapAcademyProgram(program));
  } catch (error) {
    next(error);
  }
};

export const updateAcademyProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getId(req);
    const input = req.body;
    const existing = await prisma.academyProgram.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundError("Academy program not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await prisma.academyProgram.findUnique({ where: { slug: input.slug } });
      if (duplicate) {
        throw new ConflictError("Academy program slug is already in use");
      }
    }

    const program = await prisma.academyProgram.update({
      where: { id },
      data: {
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.shortTitle !== undefined ? { shortTitle: input.shortTitle } : {}),
        ...(input.priceFrom !== undefined ? { priceFrom: input.priceFrom } : {}),
        ...(input.duration !== undefined ? { duration: input.duration } : {}),
        ...(input.format !== undefined ? { format: input.format } : {}),
        ...(input.audience !== undefined ? { audience: input.audience } : {}),
        ...(input.image !== undefined ? { image: input.image } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.overview !== undefined ? { overview: input.overview } : {}),
        ...(input.highlights !== undefined ? { highlights: input.highlights } : {}),
        ...(input.tracks !== undefined ? { tracks: input.tracks } : {}),
        ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle ?? null } : {}),
        ...(input.seoDescription !== undefined ? { seoDescription: input.seoDescription ?? null } : {}),
        ...(input.seoKeywords !== undefined ? { seoKeywords: input.seoKeywords } : {}),
        ...(input.canonicalUrl !== undefined ? { canonicalUrl: input.canonicalUrl ?? null } : {}),
        ...(input.ogImageUrl !== undefined ? { ogImageUrl: input.ogImageUrl ?? null } : {}),
        ...(input.featured !== undefined ? { featured: input.featured } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
        ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
      },
    });

    sendSuccess(res, 200, "Academy program updated successfully", mapAcademyProgram(program));
  } catch (error) {
    next(error);
  }
};

export const deleteAcademyProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.academyProgram.findUnique({ where: { id: getId(req) } });

    if (!existing) {
      throw new NotFoundError("Academy program not found");
    }

    await prisma.academyProgram.delete({ where: { id: getId(req) } });
    sendSuccess(res, 200, "Academy program deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const listPublicAcademyPrograms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const programs = await prisma.academyProgram.findMany({
      where: {
        isPublished: true,
        ...(typeof req.query.featured === "boolean" ? { featured: req.query.featured } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    sendSuccess(res, 200, "Academy programs retrieved successfully", programs.map(mapPublicAcademyProgram));
  } catch (error) {
    next(error);
  }
};

export const getPublicAcademyProgramBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const program = await prisma.academyProgram.findFirst({
      where: {
        slug: getSlug(req),
        isPublished: true,
      },
    });

    if (!program) {
      throw new NotFoundError("Academy program not found");
    }

    sendSuccess(res, 200, "Academy program retrieved successfully", mapPublicAcademyProgram(program));
  } catch (error) {
    next(error);
  }
};

export const getPublicAcademyTrackBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const program = await prisma.academyProgram.findFirst({
      where: {
        slug: String(req.params.programSlug),
        isPublished: true,
      },
    });

    if (!program) {
      throw new NotFoundError("Academy program not found");
    }

    const tracks = Array.isArray(program.tracks) ? program.tracks : [];
    const track = tracks.find((item: any) => item?.slug === String(req.params.trackSlug));

    if (!track) {
      throw new NotFoundError("Academy track not found");
    }

    sendSuccess(res, 200, "Academy track retrieved successfully", mapPublicAcademyTrack(program, track));
  } catch (error) {
    next(error);
  }
};
