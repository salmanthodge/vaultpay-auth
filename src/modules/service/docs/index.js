import { serviceTokenDocs } from './service.token.docs.js';
import { serviceIntrospectDocs } from './service.introspect.docs.js';
import { serviceUserGetDocs } from './service.userGet.docs.js';
import { serviceUserStatusDocs } from './service.userStatus.docs.js';

export const serviceDocs = {
  ...serviceTokenDocs,
  ...serviceIntrospectDocs,
  ...serviceUserGetDocs,
  ...serviceUserStatusDocs,
};
