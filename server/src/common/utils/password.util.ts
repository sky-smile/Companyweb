import { compare, hash } from 'bcryptjs';

const PASSWORD_SALT_ROUNDS = 10;

export const hashPassword = async (plainText: string): Promise<string> => {
  return hash(plainText, PASSWORD_SALT_ROUNDS);
};

export const verifyPassword = async (
  plainText: string,
  passwordHash: string,
): Promise<boolean> => {
  return compare(plainText, passwordHash);
};
