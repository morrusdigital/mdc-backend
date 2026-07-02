export const serviceInclude = {
  category: true,
} as const;

export const mapServiceCategory = (category: any) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  sortOrder: category.sortOrder,
  isActive: category.isActive,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const mapService = (service: any) => ({
  id: service.id,
  categoryId: service.categoryId,
  name: service.name,
  slug: service.slug,
  shortDescription: service.shortDescription,
  description: service.description,
  content: service.content,
  iconName: service.iconName,
  featured: service.featured,
  sortOrder: service.sortOrder,
  isPublished: service.isPublished,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
  category: service.category ? mapServiceCategory(service.category) : null,
});
