export const mapMediaAsset = (asset: any) => ({
  id: asset.id,
  filename: asset.filename,
  originalName: asset.originalName,
  mimeType: asset.mimeType,
  size: asset.size,
  diskPath: asset.diskPath,
  publicUrl: asset.publicUrl,
  altText: asset.altText,
  title: asset.title,
  uploadedBy: asset.uploadedBy
    ? {
        id: asset.uploadedBy.id,
        email: asset.uploadedBy.email,
        name: asset.uploadedBy.name,
      }
    : null,
  createdAt: asset.createdAt,
  updatedAt: asset.updatedAt,
});
