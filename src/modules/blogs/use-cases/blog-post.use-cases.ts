import prisma from "../../../config/prisma";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/app-error";
import {
  WorkflowStatuses,
  publicWorkflowWhere,
  resolveWorkflowUpdate,
} from "../../../shared/workflow/workflow";
import { blogPostInclude, mapBlogPost } from "../blogs.helpers";

const db = prisma as any;

const assertCategoryExists = async (categoryId: string) => {
  const category = await db.blogCategory.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new ValidationError("Blog category is invalid");
  }
};

const assertTagsExist = async (tagIds: string[]) => {
  if (tagIds.length === 0) {
    return;
  }

  const count = await db.tag.count({
    where: {
      id: {
        in: tagIds,
      },
    },
  });

  if (count !== tagIds.length) {
    throw new ValidationError("One or more tags are invalid");
  }
};

const mapCreateData = (input: {
  categoryId?: string | null;
  title: string;
  slug: string;
  excerpt?: string;
  content: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  featured?: boolean;
}) => ({
  title: input.title,
  slug: input.slug,
  excerpt: input.excerpt ?? null,
  content: input.content as any,
  seoTitle: input.seoTitle ?? null,
  seoDescription: input.seoDescription ?? null,
  seoKeywords: input.seoKeywords as any,
  featured: input.featured ?? false,
  status: WorkflowStatuses.DRAFT,
  ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {}),
});

const mapUpdateData = (input: {
  categoryId?: string | null;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  featured?: boolean;
}) => ({
  ...(input.categoryId !== undefined
    ? input.categoryId
      ? { category: { connect: { id: input.categoryId } } }
      : { category: { disconnect: true } }
    : {}),
  ...(input.title !== undefined && { title: input.title }),
  ...(input.slug !== undefined && { slug: input.slug }),
  ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
  ...(input.content !== undefined && { content: input.content as any }),
  ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
  ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription }),
  ...(input.seoKeywords !== undefined && { seoKeywords: input.seoKeywords as any }),
  ...(input.featured !== undefined && { featured: input.featured }),
});

export class ListBlogPostsUseCase {
  async execute() {
    const posts = await db.blogPost.findMany({
      include: blogPostInclude,
      orderBy: [{ createdAt: "desc" }],
    });

    return posts.map(mapBlogPost);
  }
}

export class GetBlogPostByIdUseCase {
  async execute(id: string) {
    const post = await db.blogPost.findUnique({
      where: { id },
      include: blogPostInclude,
    });

    if (!post) {
      throw new NotFoundError("Blog post not found");
    }

    return mapBlogPost(post);
  }
}

export class CreateBlogPostUseCase {
  async execute(input: {
    categoryId?: string | null;
    title: string;
    slug: string;
    excerpt?: string;
    content: Record<string, unknown>;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    tagIds?: string[];
    featured?: boolean;
  }) {
    const existing = await db.blogPost.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ConflictError("Blog post slug is already in use");
    }

    if (input.categoryId) {
      await assertCategoryExists(input.categoryId);
    }

    await assertTagsExist(input.tagIds || []);

    const post = await prisma.$transaction(async (tx: any) => {
      const created = await tx.blogPost.create({
        data: mapCreateData(input),
      });

      if (input.tagIds && input.tagIds.length > 0) {
        await tx.blogPostTag.createMany({
          data: input.tagIds.map((tagId) => ({
            blogPostId: created.id,
            tagId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.blogPost.findUnique({
        where: { id: created.id },
        include: blogPostInclude,
      });
    });

    if (!post) {
      throw new NotFoundError("Blog post not found");
    }

    return mapBlogPost(post);
  }
}

export class UpdateBlogPostUseCase {
  async execute(
    id: string,
    input: {
      categoryId?: string | null;
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: Record<string, unknown>;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string[];
      tagIds?: string[];
      featured?: boolean;
    }
  ) {
    const existing = await db.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Blog post not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await db.blogPost.findUnique({
        where: { slug: input.slug },
      });

      if (duplicate) {
        throw new ConflictError("Blog post slug is already in use");
      }
    }

    if (input.categoryId) {
      await assertCategoryExists(input.categoryId);
    }

    if (input.tagIds) {
      await assertTagsExist(input.tagIds);
    }

    const post = await prisma.$transaction(async (tx: any) => {
      await tx.blogPost.update({
        where: { id },
        data: mapUpdateData(input),
      });

      if (input.tagIds !== undefined) {
        await tx.blogPostTag.deleteMany({
          where: { blogPostId: id },
        });

        if (input.tagIds.length > 0) {
          await tx.blogPostTag.createMany({
            data: input.tagIds.map((tagId) => ({
              blogPostId: id,
              tagId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return tx.blogPost.findUnique({
        where: { id },
        include: blogPostInclude,
      });
    });

    if (!post) {
      throw new NotFoundError("Blog post not found");
    }

    return mapBlogPost(post);
  }
}

export class DeleteBlogPostUseCase {
  async execute(id: string) {
    const existing = await db.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Blog post not found");
    }

    await db.blogPost.delete({
      where: { id },
    });
  }
}

export class UpdateBlogPostWorkflowUseCase {
  async execute(
    id: string,
    action: "submit_review" | "approve" | "publish" | "schedule" | "archive",
    scheduleAt?: Date
  ) {
    const existing = await db.blogPost.findUnique({
      where: { id },
      include: blogPostInclude,
    });

    if (!existing) {
      throw new NotFoundError("Blog post not found");
    }

    const post = await db.blogPost.update({
      where: { id },
      data: resolveWorkflowUpdate(existing.status, action, scheduleAt),
      include: blogPostInclude,
    });

    return mapBlogPost(post);
  }
}

export class ListPublicBlogPostsUseCase {
  async execute(filters: { categorySlug?: string; tagSlug?: string; featured?: boolean }) {
    const posts = await db.blogPost.findMany({
      where: {
        ...publicWorkflowWhere(),
        ...(filters.categorySlug
          ? {
              category: {
                slug: filters.categorySlug,
              },
            }
          : {}),
        ...(filters.tagSlug
          ? {
              blogPostTags: {
                some: {
                  tag: {
                    slug: filters.tagSlug,
                  },
                },
              },
            }
          : {}),
        ...(filters.featured !== undefined ? { featured: filters.featured } : {}),
      },
      include: blogPostInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return posts.map(mapBlogPost);
  }
}

export class GetPublicBlogPostBySlugUseCase {
  async execute(slug: string) {
    const post = await db.blogPost.findFirst({
      where: {
        slug,
        ...publicWorkflowWhere(),
      },
      include: blogPostInclude,
    });

    if (!post) {
      throw new NotFoundError("Blog post not found");
    }

    return mapBlogPost(post);
  }
}
