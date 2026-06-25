export const roleAssignUserParser = (result) => ({
  assigned: Boolean(result.assigned),
  userId: result.userId,
  role: result.role,
});
