import { serializeRole } from './role.shape.js';

/** Used by create + update (both return a single role). */
export const roleDetailParser = (result) => serializeRole(result.role);
