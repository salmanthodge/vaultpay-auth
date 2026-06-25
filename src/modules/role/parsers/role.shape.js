/** Internal: shape a role row (with included permissions) into the API form. */
export const serializeRole = (role) => ({
  id: role.id,
  name: role.name,
  description: role.description,
  isSystem: role.isSystem,
  permissions: (role.permissions ?? []).map((rp) => rp.permission.code),
  createdAt: role.createdAt,
  updatedAt: role.updatedAt,
});
