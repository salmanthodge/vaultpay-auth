import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { mfaSetupService } from '../services/mfa.setup.service.js';
import { mfaSetupParser } from '../parsers/mfa.setup.parser.js';

export const mfaSetupController = asyncHandler(async (req, res) => {
  const result = await mfaSetupService({}, { userId: req.user.id });
  res.success(mfaSetupParser(result));
});
