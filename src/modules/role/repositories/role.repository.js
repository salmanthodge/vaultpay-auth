import { prisma } from '../../../shared/config/database.js';

/**
 * Role module repository — sole Prisma site for roles, permissions,
 * role_permissions and user_roles. User existence checks reuse the auth repo.
 */
export const roleRepository = {
  listRoles: ({ skip, take }) =>
    prisma.role.findMany({
      skip,
      take,
      orderBy: { name: 'asc' },
      include: { permissions: { include: { permission: true } } },
    }),
  countRoles: () => prisma.role.count(),
  findRoleById: (id) =>
    prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    }),
  findRoleByName: (name) => prisma.role.findUnique({ where: { name } }),
  createRole: (data) => prisma.role.create({ data }),
  updateRole: (id, data) => prisma.role.update({ where: { id }, data }),
  deleteRole: (id) => prisma.role.delete({ where: { id } }),

  listPermissions: () => prisma.permission.findMany({ orderBy: { code: 'asc' } }),
  findPermissionsByCodes: (codes) =>
    prisma.permission.findMany({ where: { code: { in: codes } } }),

  setRolePermissions: async (roleId, permissionIds) => {
    await prisma.rolePermission.deleteMany({ where: { roleId } });
    if (permissionIds.length) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      });
    }
  },

  assignRoleToUser: (userId, roleId) =>
    prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      update: {},
      create: { userId, roleId },
    }),
};
