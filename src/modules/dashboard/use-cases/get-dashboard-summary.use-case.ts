import prisma from "../../../config/prisma";
import { WorkflowStatuses } from "../../../shared/workflow/workflow";

const countByStatus = async (model: any, status: string) =>
  model.count({
    where: {
      status,
    },
  });

const countByAllStatuses = async (model: any, statuses: string[]) => {
  const counts = await Promise.all(
    statuses.map((status) => countByStatus(model, status))
  );
  const result: Record<string, number> = {};
  statuses.forEach((s, i) => {
    result[s] = counts[i];
  });
  return result;
};

export class GetDashboardSummaryUseCase {
  async execute() {
    const db = prisma as any;
    const statuses = Object.values(WorkflowStatuses);

    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      recentActivities,
      pendingJobs,
      recentLeads,
      blogPostCounts,
      caseStudyCounts,
      testimonialCounts,
      teamMemberCounts,
      faqItemCounts,
      totalPages,
      totalPublishedPages,
      totalServices,
      totalProjects,
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
      db.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          message: true,
          status: true,
          createdAt: true,
        },
      }),
      countByAllStatuses(db.blogPost, statuses),
      countByAllStatuses(db.caseStudy, statuses),
      countByAllStatuses(db.testimonial, statuses),
      countByAllStatuses(db.teamMember, statuses),
      countByAllStatuses(db.faqItem, statuses),
      db.page.count(),
      db.page.count({ where: { isPublished: true } }),
      db.service.count({ where: { isPublished: true } }),
      db.project.count(),
    ]);

    const sumReducer =
      (keys: string[]) =>
      (obj: Record<string, number>): number =>
        keys.reduce((acc, k) => acc + (obj[k] || 0), 0);

    const reviewKeys = [WorkflowStatuses.IN_REVIEW];
    const scheduledKeys = [WorkflowStatuses.SCHEDULED];
    const publishedKeys = [WorkflowStatuses.PUBLISHED];
    const draftKeys = [WorkflowStatuses.DRAFT];

    const contentByType = {
      blogPosts: blogPostCounts,
      caseStudies: caseStudyCounts,
      testimonials: testimonialCounts,
      teamMembers: teamMemberCounts,
      faqItems: faqItemCounts,
    };

    const pendingReviewTotal = Object.values(contentByType).reduce(
      (sum, type) => sum + sumReducer(reviewKeys)(type),
      0
    );
    const scheduledTotal = Object.values(contentByType).reduce(
      (sum, type) => sum + sumReducer(scheduledKeys)(type),
      0
    );
    const publishedTotal = Object.values(contentByType).reduce(
      (sum, type) => sum + sumReducer(publishedKeys)(type),
      0
    );
    const draftTotal = Object.values(contentByType).reduce(
      (sum, type) => sum + sumReducer(draftKeys)(type),
      0
    );

    const computedContentByType: Record<string, any> = {};
    for (const [type, counts] of Object.entries(contentByType)) {
      computedContentByType[type] = {
        ...counts,
        total: Object.values(counts).reduce((s: number, c: any) => s + c, 0),
      };
    }

    return {
      overview: {
        totalContent:
          publishedTotal +
          draftTotal +
          pendingReviewTotal +
          scheduledTotal,
        publishedContent: publishedTotal,
        draftContent: draftTotal,
        pendingReview: pendingReviewTotal,
        scheduled: scheduledTotal,
        totalPages,
        publishedPages: totalPublishedPages,
        totalServices,
        totalProjects,
      },
      content: {
        byType: computedContentByType,
        pendingReview: pendingReviewTotal,
        scheduled: scheduledTotal,
        published: publishedTotal,
        draft: draftTotal,
        pendingJobs,
      },
      leads: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        qualified: qualifiedLeads,
        recent: recentLeads,
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
