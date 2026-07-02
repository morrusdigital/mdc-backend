import prisma from "../../../config/prisma";
import { ConflictError, NotFoundError } from "../../../shared/errors/app-error";
import { publicWorkflowWhere, resolveWorkflowUpdate } from "../../../shared/workflow/workflow";
import { mapPublicTeamMember, mapTeamMember } from "../team.helpers";

const db = prisma as any;

export class ListTeamMembersUseCase {
  async execute() {
    const items = await db.teamMember.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return items.map(mapPublicTeamMember);
  }
}

export class GetTeamMemberByIdUseCase {
  async execute(id: string) {
    const item = await db.teamMember.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundError("Team member not found");
    }

    return mapPublicTeamMember(item);
  }
}

export class CreateTeamMemberUseCase {
  async execute(input: {
    name: string;
    slug: string;
    jobTitle: string;
    bio: string;
    photoUrl?: string;
    linkedinUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    canonicalUrl?: string;
    ogImageUrl?: string;
    sortOrder?: number;
    featured?: boolean;
  }) {
    const existing = await db.teamMember.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("Team member slug is already in use");
    }

    const item = await db.teamMember.create({
      data: {
        name: input.name,
        slug: input.slug,
        jobTitle: input.jobTitle,
        bio: input.bio,
        photoUrl: input.photoUrl ?? null,
        linkedinUrl: input.linkedinUrl ?? null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        seoKeywords: input.seoKeywords as any,
        canonicalUrl: input.canonicalUrl ?? null,
        ogImageUrl: input.ogImageUrl ?? null,
        sortOrder: input.sortOrder ?? 0,
        featured: input.featured ?? false,
      },
    });

    return mapTeamMember(item);
  }
}

export class UpdateTeamMemberUseCase {
  async execute(
    id: string,
    input: {
      name?: string;
      slug?: string;
      jobTitle?: string;
      bio?: string;
      photoUrl?: string;
      linkedinUrl?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string[];
      canonicalUrl?: string;
      ogImageUrl?: string;
      sortOrder?: number;
      featured?: boolean;
    }
  ) {
    const existing = await db.teamMember.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Team member not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await db.teamMember.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("Team member slug is already in use");
      }
    }

    const item = await db.teamMember.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.jobTitle !== undefined && { jobTitle: input.jobTitle }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.photoUrl !== undefined && { photoUrl: input.photoUrl }),
        ...(input.linkedinUrl !== undefined && { linkedinUrl: input.linkedinUrl }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription }),
        ...(input.seoKeywords !== undefined && { seoKeywords: input.seoKeywords as any }),
        ...(input.canonicalUrl !== undefined && { canonicalUrl: input.canonicalUrl }),
        ...(input.ogImageUrl !== undefined && { ogImageUrl: input.ogImageUrl }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.featured !== undefined && { featured: input.featured }),
      },
    });

    return mapTeamMember(item);
  }
}

export class DeleteTeamMemberUseCase {
  async execute(id: string) {
    const existing = await db.teamMember.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Team member not found");
    }

    await db.teamMember.delete({
      where: { id },
    });
  }
}

export class UpdateTeamMemberWorkflowUseCase {
  async execute(
    id: string,
    action: "submit_review" | "approve" | "publish" | "schedule" | "archive",
    scheduleAt?: Date
  ) {
    const existing = await db.teamMember.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Team member not found");
    }

    const item = await db.teamMember.update({
      where: { id },
      data: resolveWorkflowUpdate(existing.status, action, scheduleAt),
    });

    return mapTeamMember(item);
  }
}

export class ListPublicTeamMembersUseCase {
  async execute(featured?: boolean) {
    const items = await db.teamMember.findMany({
      where: {
        ...publicWorkflowWhere(),
        ...(featured !== undefined ? { featured } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    });

    return items.map(mapTeamMember);
  }
}

export class GetPublicTeamMemberBySlugUseCase {
  async execute(slug: string) {
    const item = await db.teamMember.findFirst({
      where: {
        slug,
        ...publicWorkflowWhere(),
      },
    });

    if (!item) {
      throw new NotFoundError("Team member not found");
    }

    return mapTeamMember(item);
  }
}
