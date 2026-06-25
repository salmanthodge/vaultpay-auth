import { prisma } from '../../../shared/config/database.js';

/**
 * OAuth module repository — the ONLY Prisma site for oauth_accounts. User
 * persistence is reused from the auth module's repository (single source of
 * truth for users within this service); this repo owns linked-account rows.
 */
export const oauthRepository = {
  findByProviderUser: (provider, providerUserId) =>
    prisma.oAuthAccount.findUnique({
      where: { provider_providerUserId: { provider, providerUserId } },
    }),
  findByUserAndProvider: (userId, provider) =>
    prisma.oAuthAccount.findFirst({ where: { userId, provider } }),
  listByUser: (userId) => prisma.oAuthAccount.findMany({ where: { userId } }),
  createAccount: (data) => prisma.oAuthAccount.create({ data }),
  deleteByUserAndProvider: (userId, provider) =>
    prisma.oAuthAccount.deleteMany({ where: { userId, provider } }),
};
