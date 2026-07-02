import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  AddLeadNoteUseCase,
  AssignLeadUseCase,
  ExportLeadsUseCase,
  GetLeadByIdUseCase,
  ListLeadsUseCase,
  SubmitPublicLeadUseCase,
  UpdateLeadStatusUseCase,
  UpdateLeadUseCase,
} from "./use-cases/leads.use-cases";

const submitPublicLeadUseCase = new SubmitPublicLeadUseCase();
const listLeadsUseCase = new ListLeadsUseCase();
const getLeadByIdUseCase = new GetLeadByIdUseCase();
const updateLeadUseCase = new UpdateLeadUseCase();
const updateLeadStatusUseCase = new UpdateLeadStatusUseCase();
const assignLeadUseCase = new AssignLeadUseCase();
const addLeadNoteUseCase = new AddLeadNoteUseCase();
const exportLeadsUseCase = new ExportLeadsUseCase();

const getId = (req: Request) => String(req.params.id);
const getActorContext = (req: Request) => ({
  actorId: req.authUser?.id,
  ipAddress: req.ip ?? undefined,
  userAgent:
    typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined,
});

export const submitPublicLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { website: _website, ...payload } = req.body;
    const lead = await submitPublicLeadUseCase.execute({
      ...payload,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
    sendSuccess(res, 201, "Lead submitted successfully", lead);
  } catch (error) {
    next(error);
  }
};

export const listLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await listLeadsUseCase.execute({
      ...(typeof req.query.status === "string" ? { status: req.query.status as any } : {}),
      ...(typeof req.query.assignedUserId === "number"
        ? { assignedUserId: req.query.assignedUserId }
        : {}),
      ...(typeof req.query.search === "string" ? { search: req.query.search } : {}),
    });
    sendSuccess(res, 200, "Leads retrieved successfully", leads);
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await getLeadByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Lead retrieved successfully", lead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await updateLeadUseCase.execute(getId(req), req.body, getActorContext(req));
    sendSuccess(res, 200, "Lead updated successfully", lead);
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await updateLeadStatusUseCase.execute(
      getId(req),
      req.body.status,
      getActorContext(req)
    );
    sendSuccess(res, 200, "Lead status updated successfully", lead);
  } catch (error) {
    next(error);
  }
};

export const assignLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await assignLeadUseCase.execute(getId(req), req.body.userId, {
      actorId: req.authUser!.id,
      ipAddress: req.ip ?? undefined,
      userAgent:
        typeof req.headers["user-agent"] === "string"
          ? req.headers["user-agent"]
          : undefined,
    });
    sendSuccess(res, 200, "Lead assigned successfully", lead);
  } catch (error) {
    next(error);
  }
};

export const addLeadNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await addLeadNoteUseCase.execute(getId(req), req.body.content, {
      actorId: req.authUser!.id,
      ipAddress: req.ip ?? undefined,
      userAgent:
        typeof req.headers["user-agent"] === "string"
          ? req.headers["user-agent"]
          : undefined,
    });
    sendSuccess(res, 200, "Lead note added successfully", lead);
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const csv = await exportLeadsUseCase.execute({
      ...(typeof req.query.status === "string" ? { status: req.query.status as any } : {}),
    });
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
