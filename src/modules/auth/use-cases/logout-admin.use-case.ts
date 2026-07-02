import prisma from "../../../config/prisma";

export class LogoutAdminUseCase {
  async execute(sessionId: string) {
    await prisma.adminSession.updateMany({
      where: {
        id: sessionId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
