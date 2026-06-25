/**
 * Wraps an async route handler so any rejected promise is forwarded to the
 * centralized errorHandler (rules/03). Every controller is wrapped in this.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
