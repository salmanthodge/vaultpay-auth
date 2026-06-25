import geoip from 'geoip-lite';

/**
 * Resolves the real client IP (honoring the X-Forwarded-For set by the gateway)
 * and attaches geo info, then exposes them on req for downstream auth/audit
 * (rules/05). Trust of proxy headers should be paired with `app.set('trust proxy')`.
 */
export const ipTracker = (req, _res, next) => {
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  const rawIp = (forwardedIp || req.ip || req.socket?.remoteAddress || '').trim();
  const clientIp = rawIp.replace(/^::ffff:/, '');

  req.clientIp = clientIp;

  const geo = clientIp ? geoip.lookup(clientIp) : null;
  req.geo = geo ? { country: geo.country, region: geo.region, city: geo.city } : null;

  return next();
};
