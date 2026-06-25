import { PrismaClient } from '@prisma/client';
import { env, isDevelopment } from './env.js';
import { logger } from './logger.js';

/**
 * Prisma singleton.
 *
 * HARD RULE (rules/04): this module — used only from repositories/ — is the ONLY
 * place `@prisma/client` is imported. Nothing else in the codebase may import it.
 *
 * A single instance is reused across the process to avoid exhausting DB connections.
 */
export const prisma = new PrismaClient({
  log: isDevelopment ? ['warn', 'error'] : ['error'],
});

/** Verify connectivity at boot; callers can await this before listening. */
export const connectDatabase = async () => {
  await prisma.$connect();
  logger.info('database connected');
};

/** Lightweight liveness probe for the health endpoint. */
export const pingDatabase = async () => {
  await prisma.$queryRaw`SELECT 1`;
  return true;
};

/** Graceful shutdown. */
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('database disconnected');
};

if (env.NODE_ENV !== 'test') {
  process.once('beforeExit', () => {
    void disconnectDatabase();
  });
}
