import { prisma } from '../../../shared/config/database.js';

/**
 * MFA module repository — sole Prisma site for user_mfa + mfa_backup_codes.
 * User lookups and token issuance are reused from the auth module.
 */
export const mfaRepository = {
  findByUserId: (userId) => prisma.userMfa.findUnique({ where: { userId } }),
  upsert: (userId, data) =>
    prisma.userMfa.upsert({ where: { userId }, update: data, create: { userId, ...data } }),
  update: (userId, data) => prisma.userMfa.update({ where: { userId }, data }),
  deleteByUserId: (userId) => prisma.userMfa.deleteMany({ where: { userId } }),

  // backup codes
  replaceBackupCodes: async (userId, hashes) => {
    await prisma.mfaBackupCode.deleteMany({ where: { userId } });
    if (hashes.length) {
      await prisma.mfaBackupCode.createMany({
        data: hashes.map((codeHash) => ({ userId, codeHash })),
      });
    }
  },
  deleteBackupCodes: (userId) => prisma.mfaBackupCode.deleteMany({ where: { userId } }),
  findActiveBackupCodes: (userId) =>
    prisma.mfaBackupCode.findMany({ where: { userId, consumedAt: null } }),
  consumeBackupCode: (id) =>
    prisma.mfaBackupCode.update({ where: { id }, data: { consumedAt: new Date() } }),
};
