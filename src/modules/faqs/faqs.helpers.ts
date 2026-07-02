export const faqItemInclude = {
  category: true,
} as const;

export const mapFaqCategory = (category: any) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  sortOrder: category.sortOrder,
  isActive: category.isActive,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const mapFaqItem = (item: any) => ({
  id: item.id,
  categoryId: item.categoryId,
  question: item.question,
  answer: item.answer,
  sortOrder: item.sortOrder,
  featured: item.featured,
  status: item.status,
  publishedAt: item.publishedAt,
  approvedAt: item.approvedAt,
  submittedForReviewAt: item.submittedForReviewAt,
  archivedAt: item.archivedAt,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  category: item.category ? mapFaqCategory(item.category) : null,
});
