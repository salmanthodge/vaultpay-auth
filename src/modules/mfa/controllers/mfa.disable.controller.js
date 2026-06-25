import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { mfaDisableService } from '../services/mfa.disable.service.js';
import { mfaDisableParser } from '../parsers/mfa.disable.parser.js';

export const mfaDisableController = asyncHandler(async (req, res) => {
  const result = await mfaDisableService(req.body, {
    userId: req.user.id,
    ip: req.clientIp,
    userAgent: req.headers['user-agent'],
  });
  res.success(mfaDisableParser(result));
});
