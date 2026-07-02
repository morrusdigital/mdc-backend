import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { ValidationError } from "../errors/app-error";

const sanitizeFilename = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-");

export const getUploadDir = () => {
  return process.env.UPLOAD_DIR || path.resolve(process.cwd(), "uploads");
};

export const getPublicAssetBaseUrl = () => {
  return process.env.PUBLIC_ASSET_BASE_URL || "/uploads";
};

export const storeBase64Upload = async (input: {
  originalName: string;
  mimeType: string;
  base64Data: string;
}) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ];

  if (!allowedMimeTypes.includes(input.mimeType)) {
    throw new ValidationError("Invalid media mime type");
  }

  const buffer = Buffer.from(input.base64Data, "base64");
  const maxSizeBytes = Number(process.env.MAX_UPLOAD_SIZE_MB || 5) * 1024 * 1024;

  if (buffer.length > maxSizeBytes) {
    throw new ValidationError("Uploaded file exceeds maximum size");
  }

  const uploadDir = getUploadDir();
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${crypto.randomUUID()}-${sanitizeFilename(input.originalName)}`;
  const diskPath = path.join(uploadDir, filename);
  await fs.writeFile(diskPath, buffer);

  const publicUrl = `${getPublicAssetBaseUrl().replace(/\/$/, "")}/${filename}`;

  return {
    filename,
    size: buffer.length,
    diskPath,
    publicUrl,
  };
};
