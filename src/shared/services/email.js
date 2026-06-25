import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/**
 * Email via Nodemailer + Mailtrap (free & local, rules/00). In dev without mail
 * credentials we LOG the message instead of sending, so flows never block on SMTP.
 */
let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      auth: env.MAIL_USER ? { user: env.MAIL_USER, pass: env.MAIL_PASS } : undefined,
    });
  }
  return transporter;
};

const send = async ({ to, subject, text }) => {
  if (!env.MAIL_USER) {
    logger.info({ to, subject, text }, 'email (dev log — set MAIL_USER to actually send)');
    return { delivered: false, logged: true };
  }
  await getTransporter().sendMail({ from: env.MAIL_FROM, to, subject, text });
  return { delivered: true };
};

export const sendVerificationEmail = ({ to, token }) =>
  send({
    to,
    subject: 'Verify your VaultPay email',
    text: `Welcome to VaultPay. Use this token to verify your email: ${token}`,
  });

export const sendPasswordResetEmail = ({ to, token }) =>
  send({
    to,
    subject: 'Reset your VaultPay password',
    text: `Use this token to reset your password: ${token}`,
  });
