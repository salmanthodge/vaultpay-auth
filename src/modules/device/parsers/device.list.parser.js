/** Shapes the device list for the API. */
export const deviceListParser = (result) => ({
  devices: result.devices.map((d) => ({
    id: d.id,
    name: d.name,
    ip: d.ip,
    userAgent: d.userAgent,
    geoCountry: d.geoCountry,
    isTrusted: d.isTrusted,
    revoked: Boolean(d.revokedAt),
    lastSeenAt: d.lastSeenAt,
    createdAt: d.createdAt,
  })),
});
