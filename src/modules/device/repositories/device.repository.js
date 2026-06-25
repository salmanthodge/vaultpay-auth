import { prisma } from '../../../shared/config/database.js';

/**
 * Device module repository — sole Prisma site for user_devices. Refresh-token
 * revocation is delegated to the auth repository (it owns refresh_tokens).
 */
export const deviceRepository = {
  recordDevice: ({ userId, deviceId, ip, userAgent, geoCountry }) =>
    prisma.userDevice.upsert({
      where: { userId_deviceId: { userId, deviceId } },
      update: { ip, userAgent, geoCountry, lastSeenAt: new Date(), revokedAt: null },
      create: { userId, deviceId, ip, userAgent, geoCountry },
    }),
  listByUser: (userId) =>
    prisma.userDevice.findMany({ where: { userId }, orderBy: { lastSeenAt: 'desc' } }),
  findById: (id) => prisma.userDevice.findUnique({ where: { id } }),
  revokeById: (id) =>
    prisma.userDevice.update({ where: { id }, data: { revokedAt: new Date() } }),
};
