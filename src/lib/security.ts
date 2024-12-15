import { createHash, randomBytes } from 'crypto';

export async function generateSecureToken(length: number = 32): Promise<string> {
  const buffer = randomBytes(length);
  return buffer.toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  const hash = createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}