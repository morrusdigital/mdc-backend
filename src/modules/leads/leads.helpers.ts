export const leadInclude = {
  notes: {
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
  assignments: {
    include: {
      user: true,
      assignedBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
} as const;

const mapLeadStatus = (status: string) => status.toLowerCase();

export const mapLead = (lead: any) => {
  const latestAssignment = lead.assignments?.[0] ?? null;

  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: lead.message,
    status: mapLeadStatus(lead.status),
    source: lead.source,
    sourcePage: lead.sourcePage,
    meta: lead.meta,
    currentAssignment: latestAssignment
      ? {
          id: latestAssignment.id,
          assignedAt: latestAssignment.createdAt,
          user: {
            id: latestAssignment.user.id,
            email: latestAssignment.user.email,
            name: latestAssignment.user.name,
          },
          assignedBy: {
            id: latestAssignment.assignedBy.id,
            email: latestAssignment.assignedBy.email,
            name: latestAssignment.assignedBy.name,
          },
        }
      : null,
    assignments: (lead.assignments || []).map((assignment: any) => ({
      id: assignment.id,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
      user: {
        id: assignment.user.id,
        email: assignment.user.email,
        name: assignment.user.name,
      },
      assignedBy: {
        id: assignment.assignedBy.id,
        email: assignment.assignedBy.email,
        name: assignment.assignedBy.name,
      },
    })),
    notes: (lead.notes || []).map((note: any) => ({
      id: note.id,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      author: {
        id: note.author.id,
        email: note.author.email,
        name: note.author.name,
      },
    })),
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
};

export const mapLeadStatusToDb = (
  status?: "new" | "contacted" | "qualified" | "closed" | "spam"
) => {
  if (!status) {
    return undefined;
  }

  return status.toUpperCase();
};
