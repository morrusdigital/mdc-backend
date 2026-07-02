import prisma from "../../../config/prisma";
import {
  ConflictError,
  NotFoundError,
} from "../../../shared/errors/app-error";
import { publicWorkflowWhere, resolveWorkflowUpdate } from "../../../shared/workflow/workflow";
import {
  cancelPublishJobs,
  upsertPublishJob,
} from "../../../shared/scheduler/publish-jobs.service";
import { mapCaseStudy, mapPublicCaseStudy } from "../case-studies.helpers";

const db = prisma as any;

export class ListCaseStudiesUseCase {
  async execute() {
    const items = await db.caseStudy.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return items.map(mapPublicCaseStudy);
  }
}

export class GetCaseStudyByIdUseCase {
  async execute(id: string) {
    const item = await db.caseStudy.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundError("Case study not found");
    }

    return mapPublicCaseStudy(item);
  }
}

export class CreateCaseStudyUseCase {
  async execute(input: {
    title: string;
    slug: string;
    clientName: string;
    industry: string;
    serviceType: string;
    summary: string;
    challenge: string;
    solution: string;
    outcome: string;
    results?: Record<string, unknown>;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    canonicalUrl?: string;
    ogImageUrl?: string;
    featured?: boolean;
  }) {
    const existing = await db.caseStudy.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("Case study slug is already in use");
    }

    const item = await db.caseStudy.create({
      data: {
        title: input.title,
        slug: input.slug,
        clientName: input.clientName,
        industry: input.industry,
        serviceType: input.serviceType,
        summary: input.summary,
        challenge: input.challenge,
        solution: input.solution,
        outcome: input.outcome,
        results: input.results as any,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        seoKeywords: input.seoKeywords as any,
        canonicalUrl: input.canonicalUrl ?? null,
        ogImageUrl: input.ogImageUrl ?? null,
        featured: input.featured ?? false,
      },
    });

    return mapCaseStudy(item);
  }
}

export class UpdateCaseStudyUseCase {
  async execute(
    id: string,
    input: {
      title?: string;
      slug?: string;
      clientName?: string;
      industry?: string;
      serviceType?: string;
      summary?: string;
      challenge?: string;
      solution?: string;
      outcome?: string;
      results?: Record<string, unknown>;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string[];
      canonicalUrl?: string;
      ogImageUrl?: string;
      featured?: boolean;
    }
  ) {
    const existing = await db.caseStudy.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Case study not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await db.caseStudy.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("Case study slug is already in use");
      }
    }

    const item = await db.caseStudy.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.clientName !== undefined && { clientName: input.clientName }),
        ...(input.industry !== undefined && { industry: input.industry }),
        ...(input.serviceType !== undefined && { serviceType: input.serviceType }),
        ...(input.summary !== undefined && { summary: input.summary }),
        ...(input.challenge !== undefined && { challenge: input.challenge }),
        ...(input.solution !== undefined && { solution: input.solution }),
        ...(input.outcome !== undefined && { outcome: input.outcome }),
        ...(input.results !== undefined && { results: input.results as any }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription }),
        ...(input.seoKeywords !== undefined && { seoKeywords: input.seoKeywords as any }),
        ...(input.canonicalUrl !== undefined && { canonicalUrl: input.canonicalUrl }),
        ...(input.ogImageUrl !== undefined && { ogImageUrl: input.ogImageUrl }),
        ...(input.featured !== undefined && { featured: input.featured }),
      },
    });

    return mapCaseStudy(item);
  }
}

export class DeleteCaseStudyUseCase {
  async execute(id: string) {
    const existing = await db.caseStudy.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Case study not found");
    }

    await db.caseStudy.delete({
      where: { id },
    });

    await cancelPublishJobs("case_study", id);
  }
}

export class UpdateCaseStudyWorkflowUseCase {
  async execute(
    id: string,
    action: "submit_review" | "approve" | "publish" | "schedule" | "archive",
    scheduleAt?: Date
  ) {
    const existing = await db.caseStudy.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Case study not found");
    }

    const workflowData = resolveWorkflowUpdate(existing.status, action, scheduleAt);

    const item = await db.caseStudy.update({
      where: { id },
      data: workflowData,
    });

    if (action === "schedule" && workflowData.publishedAt) {
      await upsertPublishJob({
        entityType: "case_study",
        entityId: id,
        scheduledFor: workflowData.publishedAt,
      });
    } else {
      await cancelPublishJobs("case_study", id);
    }

    return mapCaseStudy(item);
  }
}

export class ListPublicCaseStudiesUseCase {
  async execute(featured?: boolean) {
    const items = await db.caseStudy.findMany({
      where: {
        ...publicWorkflowWhere(),
        ...(featured !== undefined ? { featured } : {}),
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return items.map(mapCaseStudy);
  }
}

export class GetPublicCaseStudyBySlugUseCase {
  async execute(slug: string) {
    const item = await db.caseStudy.findFirst({
      where: {
        slug,
        ...publicWorkflowWhere(),
      },
    });

    if (!item) {
      throw new NotFoundError("Case study not found");
    }

    return mapCaseStudy(item);
  }
}
