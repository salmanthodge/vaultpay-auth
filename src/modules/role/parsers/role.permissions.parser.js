export const permissionListParser = (result) =>
  result.permissions.map((p) => ({ id: p.id, code: p.code, description: p.description }));
