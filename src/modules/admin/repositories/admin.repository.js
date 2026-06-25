import { prisma } from '../../../shared/config/database.js';

/** Admin module repository — sole Prisma site for admin_users. */
export const adminRepository = {
  findByEmail: (email) => prisma.adminUser.findUnique({ where: { email } }),
  findById: (id) => prisma.adminUser.findUnique({ where: { id } }),
  updateLastLogin: (id) =>
    prisma.adminUser.update({ where: { id }, data: { lastLoginAt: new Date() } }),
};
