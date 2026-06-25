import { serializeRole } from './role.shape.js';

export const roleListParser = (result) => result.roles.map(serializeRole);
