import { Request, Response } from "express";

export const formsFoundation = async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Forms API foundation is ready",
  });
};
