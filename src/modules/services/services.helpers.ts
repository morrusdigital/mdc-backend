import { mapSeo } from "../../shared/public-content/public-content";

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
  seoTitle: service.seoTitle,
  seoDescription: service.seoDescription,
  seoKeywords: service.seoKeywords,
  canonicalUrl: service.canonicalUrl,
  ogImageUrl: service.ogImageUrl,
  iconName: service.iconName,
  featured: service.featured,
  sortOrder: service.sortOrder,
  isPublished: service.isPublished,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
  category: service.category ? mapServiceCategory(service.category) : null,
});

export const mapPublicService = (service: any) => ({
  id: service.id,
  slug: service.slug,
  name: service.name,
  shortDescription: service.shortDescription,
  description: service.description,
  content: service.content,
  iconName: service.iconName,
  featured: service.featured,
  sortOrder: service.sortOrder,
  seo: mapSeo({
    title: service.seoTitle,
    description: service.seoDescription,
    keywords: service.seoKeywords,
    canonicalUrl: service.canonicalUrl,
    ogImageUrl: service.ogImageUrl,
    fallbackTitle: service.name,
    fallbackDescription: service.shortDescription ?? service.description,
  }),
  category: service.category
    ? {
        id: service.category.id,
        name: service.category.name,
        slug: service.category.slug,
      }
    : null,
});
