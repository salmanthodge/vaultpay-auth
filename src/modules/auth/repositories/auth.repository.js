import { prisma } from '../../../shared/config/database.js';

/**
 * Auth module repository — the ONLY place Prisma is used in this module (rules/04).
 * One repository per module; services call these methods and never touch Prisma.
 */
export const authRepository = {
  // ---- users ----
  findUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  findUserById: (id) => prisma.user.findUnique({ where: { id } }),
  createUser: (data) => prisma.user.create({ data }),
  updateUser: (id, data) => prisma.user.update({ where: { id }, data }),
  incrementFailedLogin: (id) =>
    prisma.user.update({ where: { id }, data: { failedLoginCount: { increment: 1 } } }),

  // ---- roles / permissions (token claims) ----
  findRoleByName: (name) => prisma.role.findUnique({ where: { name } }),
  assignRole: (userId, roleId) =>
    prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      update: {},
      create: { userId, roleId },
    }),
  getUserAuthContext: async (userId) => {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });
    const roles = userRoles.map((ur) => ur.role.name);
    const permissions = [
      ...new Set(
        userRoles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.code)),
      ),
    ];
    return { roles, permissions };
  },

  // ---- refresh tokens ----
  createRefreshToken: (data) => prisma.refreshToken.create({ data }),
  findRefreshTokenByHash: (tokenHash) => prisma.refreshToken.findUnique({ where: { tokenHash } }),
  revokeRefreshToken: (id, replacedBy = null) =>
    prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date(), replacedBy } }),
  revokeRefreshTokenFamily: (familyId) =>
    prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  revokeRefreshTokensByDevice: (userDeviceId) =>
    prisma.refreshToken.updateMany({
      where: { userDeviceId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),

  // ---- email verification ----
  createEmailVerification: (data) => prisma.emailVerification.create({ data }),
  findEmailVerificationByHash: (tokenHash) =>
    prisma.emailVerification.findUnique({ where: { tokenHash } }),
  consumeEmailVerification: (id) =>
    prisma.emailVerification.update({ where: { id }, data: { consumedAt: new Date() } }),

  // ---- password reset ----
  createPasswordReset: (data) => prisma.passwordReset.create({ data }),
  findPasswordResetByHash: (tokenHash) =>
    prisma.passwordReset.findUnique({ where: { tokenHash } }),
  consumePasswordReset: (id) =>
    prisma.passwordReset.update({ where: { id }, data: { consumedAt: new Date() } }),

  // revoke every active refresh token for a user (password change/reset)
  revokeAllUserRefreshTokens: (userId) =>
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),

  // ---- mfa ----
  findMfaByUserId: (userId) => prisma.userMfa.findUnique({ where: { userId } }),

  // ---- audit ----
  createAuthEvent: (data) => prisma.authEvent.create({ data }),
};
