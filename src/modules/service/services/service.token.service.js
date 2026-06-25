import { serviceRepository } from '../repositories/service.repository.js';
import { comparePassword } from '../../../shared/utils/hash.js';
import { signServiceToken, verifyServiceToken } from '../../../shared/utils/jwt.js';
import { nowSeconds } from '../../../shared/utils/date.js';
import { AuthError } from '../../../shared/errors/index.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';

/**
 * Client-credentials grant: validates a registered service client and issues a
 * short-lived S2S JWT carrying its scopes (rules/05).
 *
 * @param {{ clientId: string, clientSecret: string }} input
 */
export const serviceTokenService = async ({ clientId, clientSecret }) => {
  const client = await serviceRepository.findByClientId(clientId);
  if (!client || !client.isActive) {
    throw new AuthError(errorCodes.S2S_UNAUTHORIZED);
  }

  const secretOk = await comparePassword(clientSecret, client.clientSecretHash);
  if (!secretOk) {
    throw new AuthError(errorCodes.S2S_UNAUTHORIZED);
  }

  const scopes = Array.isArray(client.scopes) ? client.scopes : [];
  const accessToken = signServiceToken({ sub: client.clientId, scopes, type: 's2s' });
  const { exp } = verifyServiceToken(accessToken);

  return { accessToken, tokenType: 'Bearer', expiresIn: Math.max(exp - nowSeconds(), 0), scopes };
};
