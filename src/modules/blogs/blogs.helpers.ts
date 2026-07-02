export const blogPostInclude = {
  category: true,
  blogPostTags: {
    include: {
      tag: true,
    },
  },
} as const;

export const mapBlogCategory = (category: any) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  sortOrder: category.sortOrder,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const mapTag = (tag: any) => ({
  id: tag.id,
  name: tag.name,
  slug: tag.slug,
  createdAt: tag.createdAt,
  updatedAt: tag.updatedAt,
});

export const mapBlogPost = (post: any) => ({
  id: post.id,
  categoryId: post.categoryId,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  seoTitle: post.seoTitle,
  seoDescription: post.seoDescription,
  seoKeywords: post.seoKeywords,
  featured: post.featured,
  status: post.status,
  publishedAt: post.publishedAt,
  approvedAt: post.approvedAt,
  submittedForReviewAt: post.submittedForReviewAt,
  archivedAt: post.archivedAt,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  category: post.category ? mapBlogCategory(post.category) : null,
  tags: (post.blogPostTags || []).map((item: any) => mapTag(item.tag)),
});
