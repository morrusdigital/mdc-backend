export const mapTestimonial = (item: any) => ({
  id: item.id,
  name: item.name,
  role: item.role,
  company: item.company,
  quote: item.quote,
  rating: item.rating,
  sortOrder: item.sortOrder,
  featured: item.featured,
  status: item.status,
  publishedAt: item.publishedAt,
  approvedAt: item.approvedAt,
  submittedForReviewAt: item.submittedForReviewAt,
  archivedAt: item.archivedAt,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const mapPublicTestimonial = (item: any) => ({
  id: item.id,
  name: item.name,
  role: item.role,
  company: item.company,
  quote: item.quote,
  rating: item.rating,
  sortOrder: item.sortOrder,
  featured: item.featured,
  publishedAt: item.publishedAt,
});
