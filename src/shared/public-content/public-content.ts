export const mapSeo = (input: {
  title?: string | null;
  description?: string | null;
  keywords?: unknown;
  canonicalUrl?: string | null;
  ogImageUrl?: string | null;
  fallbackTitle?: string | null;
  fallbackDescription?: string | null;
}) => ({
  title: input.title ?? input.fallbackTitle ?? null,
  description: input.description ?? input.fallbackDescription ?? null,
  keywords: Array.isArray(input.keywords) ? input.keywords : [],
  canonicalUrl: input.canonicalUrl ?? null,
  ogImageUrl: input.ogImageUrl ?? null,
});

export const mapPublicNavigationItems = (items: any[]) =>
  items.map((item) => ({
    id: item.id,
    label: item.label,
    url: item.url,
    target: item.target,
    sortOrder: item.sortOrder,
    parentId: item.parentId,
  }));

export const publicSettingsGroups = new Set([
  "company_profile",
  "contact",
  "social",
]);
