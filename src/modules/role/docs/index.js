import { roleListDocs } from './role.list.docs.js';
import { roleCreateDocs } from './role.create.docs.js';
import { roleUpdateDocs } from './role.update.docs.js';
import { roleDeleteDocs } from './role.delete.docs.js';
import { rolePermissionsDocs } from './role.permissions.docs.js';
import { roleAssignUserDocs } from './role.assignUser.docs.js';

/** Merge method-level fragments that share a path (rules/07). */
export const roleDocs = {
  '/roles': { ...roleListDocs['/roles'], ...roleCreateDocs['/roles'] },
  '/roles/{id}': { ...roleUpdateDocs['/roles/{id}'], ...roleDeleteDocs['/roles/{id}'] },
  '/permissions': rolePermissionsDocs['/permissions'],
  '/users/{userId}/roles': roleAssignUserDocs['/users/{userId}/roles'],
};
