import { AppError } from './AppError.js';
import { httpStatus } from '../constants/httpStatus.js';
import { errorCodes } from '../constants/errorCodes.js';
import { messages } from '../constants/messages.js';

/** Thrown by the validate middleware when Zod parsing fails. */
export class ValidationError extends AppError {
  constructor(details = null, message = messages[errorCodes.VALIDATION_ERROR]) {
    super(message, httpStatus.UNPROCESSABLE_ENTITY, errorCodes.VALIDATION_ERROR, details);
  }
}
