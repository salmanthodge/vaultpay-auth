import { NotFoundError } from '../errors/index.js';

/** Terminal 404 for unmatched routes; forwards to errorHandler (rules/03). */
export const notFound = (req, _res, next) =>
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
