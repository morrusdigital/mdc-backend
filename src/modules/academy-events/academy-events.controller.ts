import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prisma";
import { ConflictError, NotFoundError } from "../../shared/errors/app-error";
import { sendSuccess } from "../../shared/http/response";
import { mapAcademyEvent, mapPublicAcademyEvent } from "./academy-events.helpers";

const getId = (req: Request) => String(req.params.id);
const getSlug = (req: Request) => String(req.params.slug);

export const listAcademyEvents = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await prisma.academyEvent.findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
    });
    sendSuccess(res, 200, "Academy events retrieved successfully", events.map(mapAcademyEvent));
  } catch (error) {
    next(error);
  }
};

export const getAcademyEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await prisma.academyEvent.findUnique({ where: { id: getId(req) } });
    if (!event) throw new NotFoundError("Academy event not found");
    sendSuccess(res, 200, "Academy event retrieved successfully", mapAcademyEvent(event));
  } catch (error) {
    next(error);
  }
};

export const createAcademyEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body;
    const existing = await prisma.academyEvent.findUnique({ where: { slug: input.slug } });
    if (existing) throw new ConflictError("Academy event slug is already in use");

    const event = await prisma.academyEvent.create({
      data: {
        slug: input.slug,
        title: input.title,
        category: input.category,
        summary: input.summary,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        dateLabel: input.dateLabel,
        timeLabel: input.timeLabel,
        location: input.location,
        price: input.price,
        priceLabel: input.priceLabel,
        seatLabel: input.seatLabel,
        image: input.image,
        learnings: input.learnings,
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

    sendSuccess(res, 201, "Academy event created successfully", mapAcademyEvent(event));
  } catch (error) {
    next(error);
  }
};

export const updateAcademyEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getId(req);
    const input = req.body;
    const existing = await prisma.academyEvent.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Academy event not found");

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await prisma.academyEvent.findUnique({ where: { slug: input.slug } });
      if (duplicate) throw new ConflictError("Academy event slug is already in use");
    }

    const event = await prisma.academyEvent.update({
      where: { id },
      data: {
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.summary !== undefined ? { summary: input.summary } : {}),
        ...(input.startDate !== undefined ? { startDate: new Date(input.startDate) } : {}),
        ...(input.endDate !== undefined ? { endDate: new Date(input.endDate) } : {}),
        ...(input.dateLabel !== undefined ? { dateLabel: input.dateLabel } : {}),
        ...(input.timeLabel !== undefined ? { timeLabel: input.timeLabel } : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.priceLabel !== undefined ? { priceLabel: input.priceLabel } : {}),
        ...(input.seatLabel !== undefined ? { seatLabel: input.seatLabel } : {}),
        ...(input.image !== undefined ? { image: input.image } : {}),
        ...(input.learnings !== undefined ? { learnings: input.learnings } : {}),
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

    sendSuccess(res, 200, "Academy event updated successfully", mapAcademyEvent(event));
  } catch (error) {
    next(error);
  }
};

export const deleteAcademyEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.academyEvent.findUnique({ where: { id: getId(req) } });
    if (!existing) throw new NotFoundError("Academy event not found");
    await prisma.academyEvent.delete({ where: { id: getId(req) } });
    sendSuccess(res, 200, "Academy event deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const listPublicAcademyEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await prisma.academyEvent.findMany({
      where: {
        isPublished: true,
        ...(typeof req.query.featured === "boolean" ? { featured: req.query.featured } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
    });
    sendSuccess(res, 200, "Academy events retrieved successfully", events.map(mapPublicAcademyEvent));
  } catch (error) {
    next(error);
  }
};

export const getPublicAcademyEventBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await prisma.academyEvent.findFirst({
      where: {
        slug: getSlug(req),
        isPublished: true,
      },
    });
    if (!event) throw new NotFoundError("Academy event not found");
    sendSuccess(res, 200, "Academy event retrieved successfully", mapPublicAcademyEvent(event));
  } catch (error) {
    next(error);
  }
};
