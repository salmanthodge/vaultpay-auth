import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { refreshService } from '../services/auth.refresh.service.js';
import { refreshParser } from '../parsers/auth.refresh.parser.js';

export const refreshController = asyncHandler(async (req, res) => {
  const result = await refreshService(req.body, {
    ip: req.clientIp,
    geo: req.geo,
    userAgent: req.headers['user-agent'],
  });
  res.success(refreshParser(result));
});
