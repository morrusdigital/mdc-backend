export const mapRedirectRule = (rule: any) => ({
  id: rule.id,
  sourcePath: rule.sourcePath,
  targetPath: rule.targetPath,
  statusCode: rule.statusCode,
  isActive: rule.isActive,
  note: rule.note,
  createdAt: rule.createdAt,
  updatedAt: rule.updatedAt,
});

export const mapResolvedRedirect = (rule: any) => ({
  matched: true,
  sourcePath: rule.sourcePath,
  targetPath: rule.targetPath,
  statusCode: rule.statusCode,
});
