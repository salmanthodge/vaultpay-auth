import { z } from 'zod';
import { paginationQuery } from '../../../shared/validators/common.validator.js';

export const roleListValidator = z.object({
  query: paginationQuery,
});
