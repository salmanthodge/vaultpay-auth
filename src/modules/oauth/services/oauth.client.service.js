import { env } from '../../../shared/config/env.js';
import { oauthProviders } from '../constants/oauth.providers.constant.js';

/**
 * Provider network helpers (the only place this module makes outbound HTTP).
 * Uses the global fetch (Node 20+) — no paid SDKs (rules/00).
 */
const credentials = (provider) => {
  switch (provider) {
    case 'GOOGLE':
      return { id: env.OAUTH_GOOGLE_CLIENT_ID, secret: env.OAUTH_GOOGLE_CLIENT_SECRET };
    case 'GITHUB':
      return { id: env.OAUTH_GITHUB_CLIENT_ID, secret: env.OAUTH_GITHUB_CLIENT_SECRET };
    default:
      return { id: '', secret: '' };
  }
};

export const isProviderConfigured = (provider) => {
  const { id, secret } = credentials(provider);
  return Boolean(id && secret);
};

const redirectUri = (provider) => `${env.OAUTH_REDIRECT_BASE_URL}/${provider.toLowerCase()}/callback`;

export const buildAuthorizeUrl = (provider, state) => {
  const cfg = oauthProviders.PROVIDERS[provider];
  const { id } = credentials(provider);
  const params = new URLSearchParams({
    client_id: id,
    redirect_uri: redirectUri(provider),
    response_type: 'code',
    scope: cfg.scope,
    state,
  });
  if (provider === 'GOOGLE') {
    params.set('access_type', 'offline');
    params.set('prompt', 'consent');
  }
  return `${cfg.authorizeUrl}?${params.toString()}`;
};

export const exchangeCode = async (provider, code) => {
  const cfg = oauthProviders.PROVIDERS[provider];
  const { id, secret } = credentials(provider);
  const body = new URLSearchParams({
    client_id: id,
    client_secret: secret,
    code,
    redirect_uri: redirectUri(provider),
    grant_type: 'authorization_code',
  });
  const res = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);
  const data = await res.json();
  if (!data.access_token) throw new Error('no access_token in token response');
  return data.access_token;
};

export const fetchProfile = async (provider, accessToken) => {
  const cfg = oauthProviders.PROVIDERS[provider];
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    'User-Agent': 'VaultPay',
  };
  const res = await fetch(cfg.userInfoUrl, { headers });
  if (!res.ok) throw new Error(`profile fetch failed: ${res.status}`);
  const data = await res.json();

  if (provider === 'GOOGLE') {
    return { providerUserId: String(data.sub), email: data.email ?? null, name: data.name ?? null };
  }

  // GITHUB — email may be private; fall back to the emails endpoint.
  let email = data.email ?? null;
  if (!email && cfg.emailUrl) {
    const emailRes = await fetch(cfg.emailUrl, { headers });
    if (emailRes.ok) {
      const emails = await emailRes.json();
      const primary = Array.isArray(emails)
        ? (emails.find((e) => e.primary) ?? emails[0])
        : null;
      email = primary?.email ?? null;
    }
  }
  return { providerUserId: String(data.id), email, name: data.name ?? data.login ?? null };
};
