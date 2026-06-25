/**
 * @typedef {Object} RequestContext
 * @property {string|null} [ip]
 * @property {{ country?: string, region?: string, city?: string }|null} [geo]
 * @property {string|null} [userAgent]
 */

/**
 * @typedef {Object} IssuedTokens
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {string} accessJti
 * @property {string} refreshId
 * @property {{ roles: string[], permissions: string[] }} authContext
 */

/**
 * @typedef {Object} LoginResult
 * @property {boolean} mfaRequired
 * @property {string} [mfaToken]
 * @property {Object} [user]
 * @property {string} [accessToken]
 * @property {string} [refreshToken]
 * @property {{ roles: string[], permissions: string[] }} [authContext]
 */

export {};
