import { UnauthenticatedError } from "../../../shared/errors/app-error";
import { getUserWithAccess, toAuthProfile } from "../../../shared/auth/user-access";

export class GetCurrentAdminProfileUseCase {
  async execute(userId: number) {
    const user = await getUserWithAccess(userId);
    if (!user) {
      throw new UnauthenticatedError("Admin user does not exist");
    }

    return toAuthProfile(user);
  }
}
