import { mapSeo } from "../../shared/public-content/public-content";

export const mapTeamMember = (item: any) => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  jobTitle: item.jobTitle,
  bio: item.bio,
  photoUrl: item.photoUrl,
  linkedinUrl: item.linkedinUrl,
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

export const mapPublicTeamMember = (item: any) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  jobTitle: item.jobTitle,
  bio: item.bio,
  photoUrl: item.photoUrl,
  linkedinUrl: item.linkedinUrl,
  sortOrder: item.sortOrder,
  featured: item.featured,
  publishedAt: item.publishedAt,
  seo: mapSeo({
    title: item.seoTitle,
    description: item.seoDescription,
    keywords: item.seoKeywords,
    canonicalUrl: item.canonicalUrl,
    ogImageUrl: item.ogImageUrl,
    fallbackTitle: item.name,
    fallbackDescription: item.bio,
  }),
});
