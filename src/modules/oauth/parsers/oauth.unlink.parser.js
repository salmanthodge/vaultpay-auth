/** Shapes the unlink result. */
export const oauthUnlinkParser = (result) => ({ unlinked: Boolean(result.unlinked) });
