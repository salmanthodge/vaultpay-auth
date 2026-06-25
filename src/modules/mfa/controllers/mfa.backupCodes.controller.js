import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { mfaBackupCodesService } from '../services/mfa.backupCodes.service.js';
import { mfaBackupCodesParser } from '../parsers/mfa.backupCodes.parser.js';

export const mfaBackupCodesController = asyncHandler(async (req, res) => {
  const result = await mfaBackupCodesService(req.body, { userId: req.user.id });
  res.success(mfaBackupCodesParser(result));
});
