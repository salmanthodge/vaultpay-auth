import { adminLoginDocs } from './admin.login.docs.js';
import { adminLogoutDocs } from './admin.logout.docs.js';
import { adminSessionDocs } from './admin.session.docs.js';

export const adminDocs = {
  ...adminLoginDocs,
  ...adminLogoutDocs,
  ...adminSessionDocs,
};
