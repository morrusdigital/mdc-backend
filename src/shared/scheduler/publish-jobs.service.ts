import prisma from "../../config/prisma";
import { WorkflowStatuses } from "../workflow/workflow";

const db = prisma as any;

const publishEntity = async (tx: any, entityType: string, entityId: string) => {
  const updateData = {
    status: WorkflowStatuses.PUBLISHED,
    publishedAt: new Date(),
    archivedAt: null,
  };

  if (entityType === "blog_post") {
    await tx.blogPost.update({ where: { id: entityId }, data: updateData });
    return;
  }

  if (entityType === "case_study") {
    await tx.caseStudy.update({ where: { id: entityId }, data: updateData });
    return;
  }

  if (entityType === "testimonial") {
    await tx.testimonial.update({ where: { id: entityId }, data: updateData });
    return;
  }

  if (entityType === "team_member") {
    await tx.teamMember.update({ where: { id: entityId }, data: updateData });
    return;
  }

  if (entityType === "faq_item") {
    await tx.faqItem.update({ where: { id: entityId }, data: updateData });
    return;
  }
};

export const upsertPublishJob = async (input: {
  entityType: string;
  entityId: string;
  scheduledFor: Date;
}) => {
  const existing = await db.publishJob.findFirst({
    where: {
      entityType: input.entityType,
      entityId: input.entityId,
      status: {
        in: ["PENDING", "PROCESSING"],
      },
    },
  });

  if (existing) {
    return db.publishJob.update({
      where: { id: existing.id },
      data: {
        scheduledFor: input.scheduledFor,
        status: "PENDING",
        lastError: null,
        processedAt: null,
      },
    });
  }

  return db.publishJob.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      scheduledFor: input.scheduledFor,
      status: "PENDING",
    },
  });
};

export const cancelPublishJobs = async (entityType: string, entityId: string) => {
  await db.publishJob.updateMany({
    where: {
      entityType,
      entityId,
      status: {
        in: ["PENDING", "PROCESSING"],
      },
    },
    data: {
      status: "CANCELED",
      processedAt: new Date(),
    },
  });
};

export const processPendingPublishJobs = async () => {
  const jobs = await db.publishJob.findMany({
    where: {
      status: "PENDING",
      scheduledFor: {
        lte: new Date(),
      },
    },
    orderBy: {
      scheduledFor: "asc",
    },
    take: 20,
  });

  for (const job of jobs) {
    try {
      await prisma.$transaction(async (tx: any) => {
        await tx.publishJob.update({
          where: { id: job.id },
          data: {
            status: "PROCESSING",
            attempts: job.attempts + 1,
          },
        });

        await publishEntity(tx, job.entityType, job.entityId);

        await tx.publishJob.update({
          where: { id: job.id },
          data: {
            status: "COMPLETED",
            processedAt: new Date(),
            lastError: null,
          },
        });
      });
    } catch (error: any) {
      await db.publishJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          lastError: error?.message || "Unknown scheduler error",
          processedAt: new Date(),
        },
      });
    }
  }
};

let schedulerStarted = false;

export const startPublishJobScheduler = () => {
  if (schedulerStarted) {
    return;
  }

  schedulerStarted = true;
  const intervalMs = Number(process.env.SCHEDULER_POLL_INTERVAL_MS || 30000);

  setInterval(() => {
    processPendingPublishJobs().catch((error) => {
      console.error("Publish job scheduler failed", error);
    });
  }, intervalMs);
};
