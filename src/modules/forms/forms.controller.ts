import { NextFunction, Request, Response } from "express";
import { assertHoneypotClear, enforcePublicFormRateLimit } from "../../shared/forms/rate-limit";
import { submitPublicLead } from "../leads/leads.controller";

export const formsFoundation = async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Forms API foundation is ready",
  });
};

export const submitLeadForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ipKey =
      typeof forwardedFor === "string" && forwardedFor.length > 0
        ? (forwardedFor.split(",")[0] ?? "").trim()
        : req.ip;

    enforcePublicFormRateLimit(ipKey || "unknown");
    assertHoneypotClear(req.body.website);
    await submitPublicLead(req, res, next);
  } catch (error) {
    next(error);
  }
};
