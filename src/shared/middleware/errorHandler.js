import { AppError } from '../errors/index.js';
import { httpStatus } from '../constants/httpStatus.js';
import { errorCodes } from '../constants/errorCodes.js';
import { messages } from '../constants/messages.js';
import { logger } from '../config/logger.js';
import { getContextLogger, getRequestId } from '../config/requestContext.js';
import { isProduction } from '../config/env.js';

/**
 * Centralized error handler (rules/03). The single place errors become HTTP
 * responses. Operational AppErrors map to their status/code; unknown errors are
 * masked as 500 and never leak internals/stack to clients in production.
 */
export const errorHandler = (err, req, res, _next) => {
  const isApp = err instanceof AppError;

  const statusCode = isApp ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
  const code = isApp ? err.code : errorCodes.INTERNAL_ERROR;
  const message = isApp ? err.message : messages[errorCodes.INTERNAL_ERROR];

  // Log every thrown error at the boundary, correlated to the request (rules/03).
  // Business throws (typed AppErrors) land here; DB throws are also logged at the
  // db layer. 5xx -> error, 4xx -> warn.
  const log = getContextLogger(logger);
  const requestId = getRequestId();
  if (statusCode >= 500) {
    log.error(
      { err: err.message, stack: err.stack, code, statusCode, path: req.originalUrl, requestId },
      'error thrown (server)',
    );
  } else {
    log.warn({ code, message, statusCode, path: req.originalUrl, requestId }, 'error thrown (client)');
  }

  const error = { code, message };
  if (isApp && err.details) error.details = err.details;
  if (!isProduction && statusCode >= 500) error.stack = err.stack;

  return res.status(statusCode).json({ success: false, data: null, error });
};
