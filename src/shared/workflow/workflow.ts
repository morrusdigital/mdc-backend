import { ValidationError } from "../errors/app-error";

export const WorkflowStatuses = {
  DRAFT: "DRAFT",
  IN_REVIEW: "IN_REVIEW",
  APPROVED: "APPROVED",
  SCHEDULED: "SCHEDULED",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type WorkflowStatus = (typeof WorkflowStatuses)[keyof typeof WorkflowStatuses];

export const workflowTransitions: Record<WorkflowStatus, WorkflowStatus[]> = {
  [WorkflowStatuses.DRAFT]: [WorkflowStatuses.IN_REVIEW],
  [WorkflowStatuses.IN_REVIEW]: [WorkflowStatuses.APPROVED],
  [WorkflowStatuses.APPROVED]: [WorkflowStatuses.PUBLISHED, WorkflowStatuses.SCHEDULED],
  [WorkflowStatuses.SCHEDULED]: [WorkflowStatuses.PUBLISHED],
  [WorkflowStatuses.PUBLISHED]: [WorkflowStatuses.ARCHIVED],
  [WorkflowStatuses.ARCHIVED]: [WorkflowStatuses.DRAFT],
};

export const assertWorkflowTransition = (
  currentStatus: WorkflowStatus,
  targetStatus: WorkflowStatus
) => {
  const allowedTargets = workflowTransitions[currentStatus] || [];

  if (!allowedTargets.includes(targetStatus)) {
    throw new ValidationError(
      `Invalid workflow transition from ${currentStatus.toLowerCase()} to ${targetStatus.toLowerCase()}`
    );
  }
};

export const resolveWorkflowUpdate = (
  currentStatus: WorkflowStatus,
  action: "submit_review" | "approve" | "publish" | "schedule" | "archive",
  scheduleAt?: Date
) => {
  if (action === "submit_review") {
    assertWorkflowTransition(currentStatus, WorkflowStatuses.IN_REVIEW);
    return {
      status: WorkflowStatuses.IN_REVIEW,
      submittedForReviewAt: new Date(),
    };
  }

  if (action === "approve") {
    assertWorkflowTransition(currentStatus, WorkflowStatuses.APPROVED);
    return {
      status: WorkflowStatuses.APPROVED,
      approvedAt: new Date(),
      archivedAt: null,
    };
  }

  if (action === "publish") {
    assertWorkflowTransition(currentStatus, WorkflowStatuses.PUBLISHED);
    return {
      status: WorkflowStatuses.PUBLISHED,
      publishedAt: new Date(),
      archivedAt: null,
    };
  }

  if (action === "schedule") {
    if (!scheduleAt || scheduleAt <= new Date()) {
      throw new ValidationError("publishedAt must be a future datetime");
    }

    assertWorkflowTransition(currentStatus, WorkflowStatuses.SCHEDULED);
    return {
      status: WorkflowStatuses.SCHEDULED,
      publishedAt: scheduleAt,
      archivedAt: null,
    };
  }

  assertWorkflowTransition(currentStatus, WorkflowStatuses.ARCHIVED);
  return {
    status: WorkflowStatuses.ARCHIVED,
    archivedAt: new Date(),
  };
};

export const publicWorkflowWhere = () => ({
  OR: [
    { status: WorkflowStatuses.PUBLISHED },
    {
      status: WorkflowStatuses.SCHEDULED,
      publishedAt: {
        lte: new Date(),
      },
    },
  ],
});
