import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  createMediaAsset,
  deleteMediaAsset,
  getMediaAssetById,
  listMediaAssets,
  updateMediaAsset,
} from "./media.controller";
import {
  createMediaAssetSchema,
  listMediaAssetsQuerySchema,
  mediaAssetIdParamsSchema,
  updateMediaAssetSchema,
} from "./media.schemas";

const router = Router();

router.use(requireAuth());

router.get(
  "/media-assets",
  requirePermission("media.read"),
  validateRequest(listMediaAssetsQuerySchema),
  listMediaAssets
);
router.get(
  "/media-assets/:id",
  requirePermission("media.read"),
  validateRequest(mediaAssetIdParamsSchema),
  getMediaAssetById
);
router.post(
  "/media-assets",
  requirePermission("media.create"),
  validateRequest(createMediaAssetSchema),
  createMediaAsset
);
router.patch(
  "/media-assets/:id",
  requirePermission("media.update"),
  validateRequest(updateMediaAssetSchema),
  updateMediaAsset
);
router.delete(
  "/media-assets/:id",
  requirePermission("media.delete"),
  validateRequest(mediaAssetIdParamsSchema),
  deleteMediaAsset
);

export default router;
