export const industryInclude = { solutions: { orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }] } };

export const mapIndustry = (industry: any, publicOnly = false) => ({
  id: industry.id, name: industry.name, slug: industry.slug, summary: industry.summary, hero: industry.hero,
  coverImage: industry.coverImage, sortOrder: industry.sortOrder, isPublished: industry.isPublished,
  seoTitle: industry.seoTitle, seoDescription: industry.seoDescription, seoKeywords: industry.seoKeywords,
  solutions: (industry.solutions ?? []).filter((s: any) => !publicOnly || s.isActive).map((s: any) => ({
    id: s.id, name: s.name, type: s.type, description: s.description, benefits: s.benefits, sortOrder: s.sortOrder, isActive: s.isActive,
  })),
});
