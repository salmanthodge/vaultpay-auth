import { registerDocs } from './auth.register.docs.js';
import { loginDocs } from './auth.login.docs.js';
import { refreshDocs } from './auth.refresh.docs.js';
import { logoutDocs } from './auth.logout.docs.js';
import { meDocs } from './auth.me.docs.js';
import { verifyEmailDocs } from './auth.verifyEmail.docs.js';
import { forgotPasswordDocs } from './auth.forgotPassword.docs.js';
import { resetPasswordDocs } from './auth.resetPassword.docs.js';
import { changePasswordDocs } from './auth.changePassword.docs.js';

/** Aggregated OpenAPI paths for the auth module (rules/07). */
export const authDocs = {
  ...registerDocs,
  ...loginDocs,
  ...refreshDocs,
  ...logoutDocs,
  ...meDocs,
  ...verifyEmailDocs,
  ...forgotPasswordDocs,
  ...resetPasswordDocs,
  ...changePasswordDocs,
};
