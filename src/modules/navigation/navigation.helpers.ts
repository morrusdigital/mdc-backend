export const navigationMenuInclude = {
  items: {
    orderBy: {
      sortOrder: "asc",
    },
  },
} as const;

export const publicNavigationMenuInclude = {
  items: {
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  },
} as const;

export const mapNavigationMenu = (menu: any) => ({
  id: menu.id,
  code: menu.code,
  name: menu.name,
  description: menu.description,
  createdAt: menu.createdAt,
  updatedAt: menu.updatedAt,
  items: (menu.items || []).map((item: any) => ({
    id: item.id,
    menuId: item.menuId,
    parentId: item.parentId,
    pageId: item.pageId,
    label: item.label,
    url: item.url,
    target: item.target,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  })),
});
