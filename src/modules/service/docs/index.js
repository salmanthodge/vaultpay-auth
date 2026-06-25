import { serviceTokenDocs } from './service.token.docs.js';
import { serviceIntrospectDocs } from './service.introspect.docs.js';

export const serviceDocs = {
  ...serviceTokenDocs,
  ...serviceIntrospectDocs,
};
