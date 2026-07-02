import prisma from "../../../config/prisma";
import { dispatchNotification } from "../../../shared/notifications/notification-dispatcher";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/app-error";
import { recordAuditLog } from "../../../shared/audit/audit.service";
import { leadInclude, mapLead, mapLeadStatusToDb } from "../leads.helpers";

const db = prisma as any;

const assertLeadExists = async (id: string) => {
  const lead = await db.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    throw new NotFoundError("Lead not found");
  }

  return lead;
};

const assertAssignableUserExists = async (userId: number) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isActive) {
    throw new ValidationError("Assigned user is invalid or inactive");
  }

  return user;
};

export class SubmitPublicLeadUseCase {
  async execute(input: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message?: string;
    source?: string;
    sourcePage?: string;
    meta?: Record<string, unknown>;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
  }) {
    const lead = await db.lead.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        company: input.company ?? null,
        message: input.message ?? null,
        status: "NEW",
        source: input.source ?? "website_form",
        sourcePage: input.sourcePage ?? null,
        meta: input.meta as any,
      },
      include: leadInclude,
    });

    await recordAuditLog({
      module: "leads",
      action: "public_submit",
      entityType: "lead",
      entityId: lead.id,
      summary: `Lead submitted by ${lead.email}`,
      payload: {
        source: lead.source,
        sourcePage: lead.sourcePage,
      },
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    await dispatchNotification("lead.created", {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      sourcePage: lead.sourcePage,
      createdAt: lead.createdAt.toISOString(),
    });

    return mapLead(lead);
  }
}

export class ListLeadsUseCase {
  async execute(filters: {
    status?: "new" | "contacted" | "qualified" | "closed" | "spam";
    assignedUserId?: number;
    search?: string;
  }) {
    const leads = await db.lead.findMany({
      where: {
        ...(filters.status && { status: mapLeadStatusToDb(filters.status) }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { email: { contains: filters.search, mode: "insensitive" } },
            { company: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
        ...(filters.assignedUserId && {
          assignments: {
            some: {
              userId: filters.assignedUserId,
            },
          },
        }),
      },
      include: leadInclude,
      orderBy: [{ createdAt: "desc" }],
    });

    return leads.map(mapLead);
  }
}

export class GetLeadByIdUseCase {
  async execute(id: string) {
    const lead = await db.lead.findUnique({
      where: { id },
      include: leadInclude,
    });

    if (!lead) {
      throw new NotFoundError("Lead not found");
    }

    return mapLead(lead);
  }
}

export class UpdateLeadUseCase {
  async execute(
    id: string,
    input: {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      message?: string;
      source?: string;
      sourcePage?: string;
      meta?: Record<string, unknown>;
    },
    actor: {
      actorId?: number | undefined;
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
    }
  ) {
    await assertLeadExists(id);

    const lead = await db.lead.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.company !== undefined && { company: input.company }),
        ...(input.message !== undefined && { message: input.message }),
        ...(input.source !== undefined && { source: input.source }),
        ...(input.sourcePage !== undefined && { sourcePage: input.sourcePage }),
        ...(input.meta !== undefined && { meta: input.meta as any }),
      },
      include: leadInclude,
    });

    await recordAuditLog({
      actorId: actor.actorId,
      module: "leads",
      action: "update",
      entityType: "lead",
      entityId: lead.id,
      summary: `Lead ${lead.email} updated`,
      payload: input,
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return mapLead(lead);
  }
}

export class UpdateLeadStatusUseCase {
  async execute(
    id: string,
    status: "new" | "contacted" | "qualified" | "closed" | "spam",
    actor: {
      actorId?: number | undefined;
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
    }
  ) {
    const existing = await assertLeadExists(id);
    const nextStatus = mapLeadStatusToDb(status);

    if (existing.status === nextStatus) {
      throw new ConflictError("Lead is already in the requested status");
    }

    const lead = await db.lead.update({
      where: { id },
      data: {
        status: nextStatus,
      },
      include: leadInclude,
    });

    await recordAuditLog({
      actorId: actor.actorId,
      module: "leads",
      action: "update_status",
      entityType: "lead",
      entityId: lead.id,
      summary: `Lead ${lead.email} moved to ${status}`,
      payload: {
        previousStatus: existing.status.toLowerCase(),
        nextStatus: status,
      },
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return mapLead(lead);
  }
}

export class AssignLeadUseCase {
  async execute(
    id: string,
    userId: number,
    actor: {
      actorId: number;
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
    }
  ) {
    const lead = await assertLeadExists(id);
    const user = await assertAssignableUserExists(userId);

    await db.leadAssignment.create({
      data: {
        leadId: lead.id,
        userId: user.id,
        assignedById: actor.actorId,
      },
    });

    const updatedLead = await db.lead.findUnique({
      where: { id },
      include: leadInclude,
    });

    if (!updatedLead) {
      throw new NotFoundError("Lead not found");
    }

    await recordAuditLog({
      actorId: actor.actorId,
      module: "leads",
      action: "assign",
      entityType: "lead",
      entityId: lead.id,
      summary: `Lead ${lead.email} assigned to ${user.email}`,
      payload: {
        userId: user.id,
      },
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return mapLead(updatedLead);
  }
}

export class AddLeadNoteUseCase {
  async execute(
    id: string,
    content: string,
    actor: {
      actorId: number;
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
    }
  ) {
    await assertLeadExists(id);

    await db.leadNote.create({
      data: {
        leadId: id,
        authorId: actor.actorId,
        content,
      },
    });

    const lead = await db.lead.findUnique({
      where: { id },
      include: leadInclude,
    });

    if (!lead) {
      throw new NotFoundError("Lead not found");
    }

    await recordAuditLog({
      actorId: actor.actorId,
      module: "leads",
      action: "add_note",
      entityType: "lead",
      entityId: lead.id,
      summary: `Note added to lead ${lead.email}`,
      payload: {
        content,
      },
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return mapLead(lead);
  }
}

export class ExportLeadsUseCase {
  async execute(filters: {
    status?: "new" | "contacted" | "qualified" | "closed" | "spam";
  }) {
    const leads = await db.lead.findMany({
      where: {
        ...(filters.status && { status: mapLeadStatusToDb(filters.status) }),
      },
      include: leadInclude,
      orderBy: [{ createdAt: "desc" }],
    });

    const headers = [
      "id",
      "name",
      "email",
      "phone",
      "company",
      "status",
      "source",
      "source_page",
      "assigned_to",
      "created_at",
    ];
    const rows = leads.map((lead: any) => {
      const latestAssignment = lead.assignments?.[0];
      return [
        lead.id,
        lead.name,
        lead.email,
        lead.phone ?? "",
        lead.company ?? "",
        lead.status.toLowerCase(),
        lead.source ?? "",
        lead.sourcePage ?? "",
        latestAssignment?.user?.email ?? "",
        lead.createdAt.toISOString(),
      ];
    });

    return [headers, ...rows]
      .map((columns) =>
        columns
          .map((value: string) => `"${String(value).replace(/"/g, "\"\"")}"`)
          .join(",")
      )
      .join("\n");
  }
}
