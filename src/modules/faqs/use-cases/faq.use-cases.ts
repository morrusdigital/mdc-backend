import prisma from "../../../config/prisma";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/app-error";
import { publicWorkflowWhere, resolveWorkflowUpdate } from "../../../shared/workflow/workflow";
import { faqItemInclude, mapFaqCategory, mapFaqItem } from "../faqs.helpers";

const db = prisma as any;

const assertCategoryExists = async (categoryId: string) => {
  const category = await db.faqCategory.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new ValidationError("FAQ category is invalid");
  }
};

export class ListFaqCategoriesUseCase {
  async execute() {
    const categories = await db.faqCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return categories.map(mapFaqCategory);
  }
}

export class CreateFaqCategoryUseCase {
  async execute(input: {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    const existing = await db.faqCategory.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("FAQ category slug is already in use");
    }

    const category = await db.faqCategory.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? true,
      },
    });

    return mapFaqCategory(category);
  }
}

export class UpdateFaqCategoryUseCase {
  async execute(
    id: string,
    input: {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) {
    const existing = await db.faqCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("FAQ category not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await db.faqCategory.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("FAQ category slug is already in use");
      }
    }

    const category = await db.faqCategory.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });

    return mapFaqCategory(category);
  }
}

export class DeleteFaqCategoryUseCase {
  async execute(id: string) {
    const existing = await db.faqCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("FAQ category not found");
    }

    await db.faqCategory.delete({
      where: { id },
    });
  }
}

export class ListFaqItemsUseCase {
  async execute() {
    const items = await db.faqItem.findMany({
      include: faqItemInclude,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return items.map(mapFaqItem);
  }
}

export class GetFaqItemByIdUseCase {
  async execute(id: string) {
    const item = await db.faqItem.findUnique({
      where: { id },
      include: faqItemInclude,
    });

    if (!item) {
      throw new NotFoundError("FAQ item not found");
    }

    return mapFaqItem(item);
  }
}

export class CreateFaqItemUseCase {
  async execute(input: {
    categoryId?: string | null;
    question: string;
    answer: string;
    sortOrder?: number;
    featured?: boolean;
  }) {
    if (input.categoryId) {
      await assertCategoryExists(input.categoryId);
    }

    const item = await db.faqItem.create({
      data: {
        ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {}),
        question: input.question,
        answer: input.answer,
        sortOrder: input.sortOrder ?? 0,
        featured: input.featured ?? false,
      },
      include: faqItemInclude,
    });

    return mapFaqItem(item);
  }
}

export class UpdateFaqItemUseCase {
  async execute(
    id: string,
    input: {
      categoryId?: string | null;
      question?: string;
      answer?: string;
      sortOrder?: number;
      featured?: boolean;
    }
  ) {
    const existing = await db.faqItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("FAQ item not found");
    }

    if (input.categoryId) {
      await assertCategoryExists(input.categoryId);
    }

    const item = await db.faqItem.update({
      where: { id },
      data: {
        ...(input.categoryId !== undefined
          ? input.categoryId
            ? { category: { connect: { id: input.categoryId } } }
            : { category: { disconnect: true } }
          : {}),
        ...(input.question !== undefined && { question: input.question }),
        ...(input.answer !== undefined && { answer: input.answer }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.featured !== undefined && { featured: input.featured }),
      },
      include: faqItemInclude,
    });

    return mapFaqItem(item);
  }
}

export class DeleteFaqItemUseCase {
  async execute(id: string) {
    const existing = await db.faqItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("FAQ item not found");
    }

    await db.faqItem.delete({
      where: { id },
    });
  }
}

export class UpdateFaqItemWorkflowUseCase {
  async execute(
    id: string,
    action: "submit_review" | "approve" | "publish" | "schedule" | "archive",
    scheduleAt?: Date
  ) {
    const existing = await db.faqItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("FAQ item not found");
    }

    const item = await db.faqItem.update({
      where: { id },
      data: resolveWorkflowUpdate(existing.status, action, scheduleAt),
      include: faqItemInclude,
    });

    return mapFaqItem(item);
  }
}

export class ListPublicFaqsUseCase {
  async execute(filters: { categorySlug?: string; featured?: boolean }) {
    const categories = await db.faqCategory.findMany({
      where: {
        ...(filters.categorySlug ? { slug: filters.categorySlug } : {}),
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        faqItems: {
          where: {
            ...publicWorkflowWhere(),
            ...(filters.featured !== undefined ? { featured: filters.featured } : {}),
          },
          orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
        },
      },
    });

    return categories.map((category: any) => ({
      ...mapFaqCategory(category),
      items: category.faqItems.map((item: any) => mapFaqItem({ ...item, category })),
    }));
  }
}
