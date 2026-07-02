import prisma from "../../../config/prisma";
import { ConflictError, NotFoundError } from "../../../shared/errors/app-error";
import { mapRedirectRule, mapResolvedRedirect } from "../redirects.helpers";

const db = prisma as any;

export class ListRedirectRulesUseCase {
  async execute() {
    const rules = await db.redirectRule.findMany({
      orderBy: [{ sourcePath: "asc" }],
    });

    return rules.map(mapRedirectRule);
  }
}

export class GetRedirectRuleByIdUseCase {
  async execute(id: string) {
    const rule = await db.redirectRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundError("Redirect rule not found");
    }

    return mapRedirectRule(rule);
  }
}

export class CreateRedirectRuleUseCase {
  async execute(input: {
    sourcePath: string;
    targetPath: string;
    statusCode: 301 | 302;
    isActive?: boolean;
    note?: string;
  }) {
    const existing = await db.redirectRule.findUnique({
      where: { sourcePath: input.sourcePath },
    });

    if (existing) {
      throw new ConflictError("Redirect source path is already in use");
    }

    const rule = await db.redirectRule.create({
      data: {
        sourcePath: input.sourcePath,
        targetPath: input.targetPath,
        statusCode: input.statusCode,
        isActive: input.isActive ?? true,
        note: input.note ?? null,
      },
    });

    return mapRedirectRule(rule);
  }
}

export class UpdateRedirectRuleUseCase {
  async execute(
    id: string,
    input: {
      sourcePath?: string;
      targetPath?: string;
      statusCode?: 301 | 302;
      isActive?: boolean;
      note?: string;
    }
  ) {
    const existing = await db.redirectRule.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Redirect rule not found");
    }

    if (input.sourcePath && input.sourcePath !== existing.sourcePath) {
      const duplicate = await db.redirectRule.findUnique({
        where: { sourcePath: input.sourcePath },
      });

      if (duplicate) {
        throw new ConflictError("Redirect source path is already in use");
      }
    }

    const rule = await db.redirectRule.update({
      where: { id },
      data: {
        ...(input.sourcePath !== undefined && { sourcePath: input.sourcePath }),
        ...(input.targetPath !== undefined && { targetPath: input.targetPath }),
        ...(input.statusCode !== undefined && { statusCode: input.statusCode }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.note !== undefined && { note: input.note }),
      },
    });

    return mapRedirectRule(rule);
  }
}

export class DeleteRedirectRuleUseCase {
  async execute(id: string) {
    const existing = await db.redirectRule.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Redirect rule not found");
    }

    await db.redirectRule.delete({
      where: { id },
    });
  }
}

export class ResolveRedirectUseCase {
  async execute(path: string) {
    const rule = await db.redirectRule.findFirst({
      where: {
        sourcePath: path,
        isActive: true,
      },
    });

    if (!rule) {
      return {
        matched: false,
        sourcePath: path,
        targetPath: null,
        statusCode: null,
      };
    }

    return mapResolvedRedirect(rule);
  }
}
