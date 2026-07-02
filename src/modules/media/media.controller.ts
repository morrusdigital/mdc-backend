import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  CreateMediaAssetUseCase,
  DeleteMediaAssetUseCase,
  GetMediaAssetByIdUseCase,
  ListMediaAssetsUseCase,
  UpdateMediaAssetUseCase,
} from "./use-cases/media.use-cases";

const listMediaAssetsUseCase = new ListMediaAssetsUseCase();
const getMediaAssetByIdUseCase = new GetMediaAssetByIdUseCase();
const createMediaAssetUseCase = new CreateMediaAssetUseCase();
const updateMediaAssetUseCase = new UpdateMediaAssetUseCase();
const deleteMediaAssetUseCase = new DeleteMediaAssetUseCase();

const getId = (req: Request) => String(req.params.id);
const actor = (req: Request) => ({
  actorId: req.authUser!.id,
  ipAddress: req.ip ?? undefined,
  userAgent:
    typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined,
});

export const listMediaAssets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assets = await listMediaAssetsUseCase.execute({
      ...(typeof req.query.mimeType === "string" ? { mimeType: req.query.mimeType } : {}),
      ...(typeof req.query.search === "string" ? { search: req.query.search } : {}),
    });
    sendSuccess(res, 200, "Media assets retrieved successfully", assets);
  } catch (error) {
    next(error);
  }
};

export const getMediaAssetById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const asset = await getMediaAssetByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Media asset retrieved successfully", asset);
  } catch (error) {
    next(error);
  }
};

export const createMediaAsset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const asset = await createMediaAssetUseCase.execute(req.body, actor(req));
    sendSuccess(res, 201, "Media asset created successfully", asset);
  } catch (error) {
    next(error);
  }
};

export const updateMediaAsset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const asset = await updateMediaAssetUseCase.execute(getId(req), req.body, actor(req));
    sendSuccess(res, 200, "Media asset updated successfully", asset);
  } catch (error) {
    next(error);
  }
};

export const deleteMediaAsset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteMediaAssetUseCase.execute(getId(req), actor(req));
    sendSuccess(res, 200, "Media asset deleted successfully");
  } catch (error) {
    next(error);
  }
};
