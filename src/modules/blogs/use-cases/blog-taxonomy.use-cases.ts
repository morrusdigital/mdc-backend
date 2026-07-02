import prisma from "../../../config/prisma";
import {
  ConflictError,
  NotFoundError,
} from "../../../shared/errors/app-error";
import { mapBlogCategory, mapTag } from "../blogs.helpers";

const db = prisma as any;

export class ListBlogCategoriesUseCase {
  async execute() {
    const categories = await db.blogCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return categories.map(mapBlogCategory);
  }
}

export class CreateBlogCategoryUseCase {
  async execute(input: {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
  }) {
    const existing = await db.blogCategory.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("Blog category slug is already in use");
    }

    const category = await db.blogCategory.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        sortOrder: input.sortOrder ?? 0,
      },
    });

    return mapBlogCategory(category);
  }
}

export class UpdateBlogCategoryUseCase {
  async execute(
    id: string,
    input: {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
    }
  ) {
    const existing = await db.blogCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Blog category not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await db.blogCategory.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("Blog category slug is already in use");
      }
    }

    const category = await db.blogCategory.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      },
    });

    return mapBlogCategory(category);
  }
}

export class DeleteBlogCategoryUseCase {
  async execute(id: string) {
    const existing = await db.blogCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Blog category not found");
    }

    await db.blogCategory.delete({
      where: { id },
    });
  }
}

export class ListTagsUseCase {
  async execute() {
    const tags = await db.tag.findMany({
      orderBy: [{ name: "asc" }],
    });

    return tags.map(mapTag);
  }
}

export class CreateTagUseCase {
  async execute(input: { name: string; slug: string }) {
    const existing = await db.tag.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("Tag slug is already in use");
    }

    const tag = await db.tag.create({
      data: {
        name: input.name,
        slug: input.slug,
      },
    });

    return mapTag(tag);
  }
}

export class UpdateTagUseCase {
  async execute(id: string, input: { name?: string; slug?: string }) {
    const existing = await db.tag.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Tag not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await db.tag.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("Tag slug is already in use");
      }
    }

    const tag = await db.tag.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
      },
    });

    return mapTag(tag);
  }
}

export class DeleteTagUseCase {
  async execute(id: string) {
    const existing = await db.tag.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Tag not found");
    }

    await db.tag.delete({
      where: { id },
    });
  }
}
