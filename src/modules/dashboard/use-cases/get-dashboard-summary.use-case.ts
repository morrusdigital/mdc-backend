import prisma from "../../../config/prisma";
import { WorkflowStatuses } from "../../../shared/workflow/workflow";

const countByStatus = async (model: any, status: string) =>
  model.count({
    where: {
      status,
    },
  });

export class GetDashboardSummaryUseCase {
  async execute() {
    const db = prisma as any;
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      recentActivities,
      pendingJobs,
      pendingReviewCounts,
      scheduledCounts,
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: "NEW" } }),
      db.lead.count({ where: { status: "CONTACTED" } }),
      db.lead.count({ where: { status: "QUALIFIED" } }),
      db.auditLog.findMany({
        include: {
          actor: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
      db.publishJob.count({
        where: {
          status: "PENDING",
        },
      }),
      Promise.all([
        countByStatus(db.blogPost, WorkflowStatuses.IN_REVIEW),
        countByStatus(db.caseStudy, WorkflowStatuses.IN_REVIEW),
        countByStatus(db.testimonial, WorkflowStatuses.IN_REVIEW),
        countByStatus(db.teamMember, WorkflowStatuses.IN_REVIEW),
        countByStatus(db.faqItem, WorkflowStatuses.IN_REVIEW),
      ]),
      Promise.all([
        countByStatus(db.blogPost, WorkflowStatuses.SCHEDULED),
        countByStatus(db.caseStudy, WorkflowStatuses.SCHEDULED),
        countByStatus(db.testimonial, WorkflowStatuses.SCHEDULED),
        countByStatus(db.teamMember, WorkflowStatuses.SCHEDULED),
        countByStatus(db.faqItem, WorkflowStatuses.SCHEDULED),
      ]),
    ]);

    return {
      leads: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        qualified: qualifiedLeads,
      },
      content: {
        pendingReview: pendingReviewCounts.reduce((sum: number, count: number) => sum + count, 0),
        scheduled: scheduledCounts.reduce((sum: number, count: number) => sum + count, 0),
        pendingJobs,
      },
      recentActivity: recentActivities.map((log: any) => ({
        id: log.id,
        module: log.module,
        action: log.action,
        summary: log.summary,
        createdAt: log.createdAt,
        actor: log.actor
          ? {
              id: log.actor.id,
              email: log.actor.email,
              name: log.actor.name,
            }
          : null,
      })),
    };
  }
}
