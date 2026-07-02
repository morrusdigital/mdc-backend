export const pageInclude = {
  sections: {
    orderBy: {
      sortOrder: "asc",
    },
  },
} as const;

export const publicPageInclude = {
  sections: {
    where: {
      isEnabled: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  },
} as const;

export const mapPage = (page: any) => ({
  id: page.id,
  title: page.title,
  slug: page.slug,
  excerpt: page.excerpt,
  seoTitle: page.seoTitle,
  seoDescription: page.seoDescription,
  seoKeywords: page.seoKeywords,
  isPublished: page.isPublished,
  publishedAt: page.publishedAt,
  createdAt: page.createdAt,
  updatedAt: page.updatedAt,
  sections: (page.sections || []).map((section: any) => ({
    id: section.id,
    type: section.type,
    label: section.label,
    sortOrder: section.sortOrder,
    isEnabled: section.isEnabled,
    content: section.content,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  })),
});
