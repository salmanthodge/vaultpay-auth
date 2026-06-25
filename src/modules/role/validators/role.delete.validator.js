import { z } from 'zod';
import { idParams } from '../../../shared/validators/common.validator.js';

export const roleDeleteValidator = z.object({
  params: idParams,
});
