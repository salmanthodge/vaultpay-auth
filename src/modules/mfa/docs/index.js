import { mfaSetupDocs } from './mfa.setup.docs.js';
import { mfaEnableDocs } from './mfa.enable.docs.js';
import { mfaVerifyDocs } from './mfa.verify.docs.js';
import { mfaDisableDocs } from './mfa.disable.docs.js';
import { mfaBackupCodesDocs } from './mfa.backupCodes.docs.js';

export const mfaDocs = {
  ...mfaSetupDocs,
  ...mfaEnableDocs,
  ...mfaVerifyDocs,
  ...mfaDisableDocs,
  ...mfaBackupCodesDocs,
};
