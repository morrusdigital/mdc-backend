import fs from "fs/promises";
import prisma from "../../../config/prisma";
import { recordAuditLog } from "../../../shared/audit/audit.service";
import { NotFoundError } from "../../../shared/errors/app-error";
import { storeBase64Upload } from "../../../shared/uploads/upload.service";
import { mapMediaAsset } from "../media.helpers";

const db = prisma as any;

const mediaAssetInclude = {
  uploadedBy: true,
} as const;

export class ListMediaAssetsUseCase {
  async execute(filters: { mimeType?: string; search?: string }) {
    const assets = await db.mediaAsset.findMany({
      where: {
        ...(filters.mimeType && { mimeType: filters.mimeType }),
        ...(filters.search && {
          OR: [
            { originalName: { contains: filters.search, mode: "insensitive" } },
            { title: { contains: filters.search, mode: "insensitive" } },
            { altText: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      include: mediaAssetInclude,
      orderBy: [{ createdAt: "desc" }],
    });

    return assets.map(mapMediaAsset);
  }
}

export class GetMediaAssetByIdUseCase {
  async execute(id: string) {
    const asset = await db.mediaAsset.findUnique({
      where: { id },
      include: mediaAssetInclude,
    });

    if (!asset) {
      throw new NotFoundError("Media asset not found");
    }

    return mapMediaAsset(asset);
  }
}

export class CreateMediaAssetUseCase {
  async execute(
    input: {
      originalName: string;
      mimeType: string;
      base64Data: string;
      altText?: string;
      title?: string;
    },
    actor: {
      actorId: number;
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
    }
  ) {
    const upload = await storeBase64Upload(input);
    const asset = await db.mediaAsset.create({
      data: {
        filename: upload.filename,
        originalName: input.originalName,
        mimeType: input.mimeType,
        size: upload.size,
        diskPath: upload.diskPath,
        publicUrl: upload.publicUrl,
        altText: input.altText ?? null,
        title: input.title ?? null,
        uploadedById: actor.actorId,
      },
      include: mediaAssetInclude,
    });

    await recordAuditLog({
      actorId: actor.actorId,
      module: "media",
      action: "create",
      entityType: "media_asset",
      entityId: asset.id,
      summary: `Media asset ${asset.originalName} uploaded`,
      payload: {
        mimeType: asset.mimeType,
        size: asset.size,
      },
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return mapMediaAsset(asset);
  }
}

export class UpdateMediaAssetUseCase {
  async execute(
    id: string,
    input: {
      altText?: string | null;
      title?: string | null;
    },
    actor: {
      actorId: number;
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
    }
  ) {
    const existing = await db.mediaAsset.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Media asset not found");
    }

    const asset = await db.mediaAsset.update({
      where: { id },
      data: {
        ...(input.altText !== undefined && { altText: input.altText }),
        ...(input.title !== undefined && { title: input.title }),
      },
      include: mediaAssetInclude,
    });

    await recordAuditLog({
      actorId: actor.actorId,
      module: "media",
      action: "update",
      entityType: "media_asset",
      entityId: asset.id,
      summary: `Media asset ${asset.originalName} updated`,
      payload: input,
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return mapMediaAsset(asset);
  }
}

export class DeleteMediaAssetUseCase {
  async execute(
    id: string,
    actor: {
      actorId: number;
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
    }
  ) {
    const existing = await db.mediaAsset.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Media asset not found");
    }

    await db.mediaAsset.delete({
      where: { id },
    });

    await fs.unlink(existing.diskPath).catch(() => undefined);

    await recordAuditLog({
      actorId: actor.actorId,
      module: "media",
      action: "delete",
      entityType: "media_asset",
      entityId: existing.id,
      summary: `Media asset ${existing.originalName} deleted`,
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });
  }
}
