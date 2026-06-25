import { prisma } from '../../../shared/config/database.js';

/** Service module repository — sole Prisma site for service_clients. */
export const serviceRepository = {
  findByClientId: (clientId) => prisma.serviceClient.findUnique({ where: { clientId } }),
  createClient: (data) => prisma.serviceClient.create({ data }),
};
