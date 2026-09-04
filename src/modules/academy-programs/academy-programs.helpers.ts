import { mapSeo } from "../../shared/public-content/public-content";

export const mapAcademyProgram = (program: any) => ({
  id: program.id,
  slug: program.slug,
  title: program.title,
  shortTitle: program.shortTitle,
  priceFrom: program.priceFrom,
  duration: program.duration,
  format: program.format,
  audience: program.audience,
  image: program.image,
  description: program.description,
  overview: program.overview,
  highlights: program.highlights,
  tracks: program.tracks,
  seoTitle: program.seoTitle,
  seoDescription: program.seoDescription,
  seoKeywords: program.seoKeywords,
  canonicalUrl: program.canonicalUrl,
  ogImageUrl: program.ogImageUrl,
  featured: program.featured,
  sortOrder: program.sortOrder,
  isPublished: program.isPublished,
  createdAt: program.createdAt,
  updatedAt: program.updatedAt,
});

export const mapPublicAcademyProgram = (program: any) => ({
  id: program.id,
  slug: program.slug,
  title: program.title,
  shortTitle: program.shortTitle,
  priceFrom: program.priceFrom,
  duration: program.duration,
  format: program.format,
  audience: program.audience,
  image: program.image,
  description: program.description,
  overview: program.overview,
  highlights: program.highlights,
  tracks: program.tracks,
  featured: program.featured,
  sortOrder: program.sortOrder,
  seo: mapSeo({
    title: program.seoTitle,
    description: program.seoDescription,
    keywords: program.seoKeywords,
    canonicalUrl: program.canonicalUrl,
    ogImageUrl: program.ogImageUrl,
    fallbackTitle: program.title,
    fallbackDescription: program.description,
  }),
});

export const mapPublicAcademyTrack = (program: any, track: any) => ({
  program: mapPublicAcademyProgram(program),
  track,
});
