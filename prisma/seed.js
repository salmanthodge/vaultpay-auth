/**
 * Idempotent seed (rules/10): safe to re-run. Seeds the RBAC registry (permissions,
 * system roles), grants all permissions to ADMIN, and creates a dev super-admin.
 * Dev-only credentials — never use these values in production.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PERMISSIONS = [
  { code: 'USER_READ', description: 'Read user records' },
  { code: 'USER_WRITE', description: 'Create/update user records' },
  { code: 'ROLE_READ', description: 'Read roles' },
  { code: 'ROLE_WRITE', description: 'Create/update roles' },
  { code: 'ROLE_DELETE', description: 'Delete roles' },
  { code: 'PERMISSION_READ', description: 'Read permissions' },
  { code: 'SERVICE_CLIENT_READ', description: 'Read S2S clients' },
  { code: 'SERVICE_CLIENT_WRITE', description: 'Create/update S2S clients' },
  { code: 'AUDIT_READ', description: 'Read audit events' },
];

async function main() {
  // 1. permissions
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: { description: permission.description },
      create: permission,
    });
  }

  // 2. system roles
  const customer = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: { name: 'CUSTOMER', description: 'Standard customer account', isSystem: true },
  });
  const admin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Platform administrator', isSystem: true },
  });

  // 3. grant all permissions to ADMIN
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: admin.id, permissionId: permission.id } },
      update: {},
      create: { roleId: admin.id, permissionId: permission.id },
    });
  }

  // 4. dev super-admin (back-office)
  const passwordHash = await bcrypt.hash('Admin@12345', 12);
  await prisma.adminUser.upsert({
    where: { email: 'admin@vaultpay.local' },
    update: {},
    create: {
      email: 'admin@vaultpay.local',
      passwordHash,
      fullName: 'Dev Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  // 5. dev S2S clients (so other services can obtain S2S tokens locally)
  const DEV_S2S_SECRET = 'dev-s2s-secret-change-me';
  const SERVICE_CLIENTS = [
    { clientId: 'gateway', name: 'API Gateway', scopes: ['user:read', 'token:introspect'] },
    { clientId: 'wallet-service', name: 'Wallet Service', scopes: ['user:read'] },
    { clientId: 'vault-service', name: 'Vault Service', scopes: ['user:read'] },
    { clientId: 'admin-service', name: 'Admin Service', scopes: ['user:read', 'user:write'] },
  ];
  const clientSecretHash = await bcrypt.hash(DEV_S2S_SECRET, 12);
  for (const client of SERVICE_CLIENTS) {
    await prisma.serviceClient.upsert({
      where: { clientId: client.clientId },
      update: { name: client.name, scopes: client.scopes },
      create: { ...client, clientSecretHash },
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `Seed complete: ${PERMISSIONS.length} permissions, roles [${customer.name}, ${admin.name}], dev admin admin@vaultpay.local, ${SERVICE_CLIENTS.length} S2S clients (secret: ${DEV_S2S_SECRET})`,
  );
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
