import prisma from "../../../config/prisma";
import { NotFoundError } from "../../../shared/errors/app-error";
import { publicWorkflowWhere, resolveWorkflowUpdate } from "../../../shared/workflow/workflow";
import { mapPublicTestimonial, mapTestimonial } from "../testimonials.helpers";

const db = prisma as any;

export class ListTestimonialsUseCase {
  async execute() {
    const items = await db.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return items.map(mapPublicTestimonial);
  }
}

export class GetTestimonialByIdUseCase {
  async execute(id: string) {
    const item = await db.testimonial.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundError("Testimonial not found");
    }

    return mapTestimonial(item);
  }
}

export class CreateTestimonialUseCase {
  async execute(input: {
    name: string;
    role: string;
    company: string;
    quote: string;
    rating?: number;
    sortOrder?: number;
    featured?: boolean;
  }) {
    const item = await db.testimonial.create({
      data: {
        name: input.name,
        role: input.role,
        company: input.company,
        quote: input.quote,
        rating: input.rating ?? null,
        sortOrder: input.sortOrder ?? 0,
        featured: input.featured ?? false,
      },
    });

    return mapTestimonial(item);
  }
}

export class UpdateTestimonialUseCase {
  async execute(
    id: string,
    input: {
      name?: string;
      role?: string;
      company?: string;
      quote?: string;
      rating?: number;
      sortOrder?: number;
      featured?: boolean;
    }
  ) {
    const existing = await db.testimonial.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Testimonial not found");
    }

    const item = await db.testimonial.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.role !== undefined && { role: input.role }),
        ...(input.company !== undefined && { company: input.company }),
        ...(input.quote !== undefined && { quote: input.quote }),
        ...(input.rating !== undefined && { rating: input.rating }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.featured !== undefined && { featured: input.featured }),
      },
    });

    return mapTestimonial(item);
  }
}

export class DeleteTestimonialUseCase {
  async execute(id: string) {
    const existing = await db.testimonial.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Testimonial not found");
    }

    await db.testimonial.delete({
      where: { id },
    });
  }
}

export class UpdateTestimonialWorkflowUseCase {
  async execute(
    id: string,
    action: "submit_review" | "approve" | "publish" | "schedule" | "archive",
    scheduleAt?: Date
  ) {
    const existing = await db.testimonial.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Testimonial not found");
    }

    const item = await db.testimonial.update({
      where: { id },
      data: resolveWorkflowUpdate(existing.status, action, scheduleAt),
    });

    return mapTestimonial(item);
  }
}

export class ListPublicTestimonialsUseCase {
  async execute(featured?: boolean) {
    const items = await db.testimonial.findMany({
      where: {
        ...publicWorkflowWhere(),
        ...(featured !== undefined ? { featured } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    });

    return items.map(mapTestimonial);
  }
}
