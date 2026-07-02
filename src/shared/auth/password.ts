import bcrypt from "bcryptjs";

const PASSWORD_SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  passwordHash: string | null | undefined
) => {
  if (!passwordHash) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
};
