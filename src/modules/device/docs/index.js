import { deviceListDocs } from './device.list.docs.js';
import { deviceRevokeDocs } from './device.revoke.docs.js';

export const deviceDocs = {
  ...deviceListDocs,
  ...deviceRevokeDocs,
};
