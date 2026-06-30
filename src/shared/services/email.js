import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/**
 * Email via Nodemailer. Configure a real SMTP provider in .env (MAIL_HOST/PORT/
 * USER/PASS). In dev WITHOUT credentials (MAIL_USER empty) we LOG the message
 * instead of sending, so flows never block on SMTP.
 */
let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_PORT === 465, // 465 = implicit TLS; 587/2525 = STARTTLS
      auth: env.MAIL_USER ? { user: env.MAIL_USER, pass: env.MAIL_PASS } : undefined,
    });
  }
  return transporter;
};

const send = async ({ to, subject, text, html }) => {
  if (!env.MAIL_USER) {
    logger.info({ to, subject, text }, 'email (dev log — set MAIL_USER to actually send)');
    return { delivered: false, logged: true };
  }
  await getTransporter().sendMail({ from: env.MAIL_FROM, to, subject, text, html });
  return { delivered: true };
};

/** Minimal, email-client-safe HTML with a call-to-action button. */
const layout = ({ heading, intro, buttonLabel, url, note }) => `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1F2937">
    <h2 style="color:#1F2937;margin:0 0 12px">${heading}</h2>
    <p style="font-size:14px;line-height:22px;margin:0 0 20px">${intro}</p>
    <p style="margin:0 0 20px">
      <a href="${url}" style="background:#2563EB;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:14px;display:inline-block">${buttonLabel}</a>
    </p>
    <p style="font-size:12px;color:#6B7280;line-height:18px;margin:0 0 6px">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="font-size:12px;word-break:break-all;margin:0 0 16px"><a href="${url}" style="color:#2563EB">${url}</a></p>
    <p style="font-size:12px;color:#6B7280;line-height:18px;margin:0">${note}</p>
  </div>
`;

export const sendVerificationEmail = ({ to, token }) => {
  const url = `${env.WEB_APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
  return send({
    to,
    subject: 'Verify your VaultPay email',
    text: `Welcome to VaultPay! Confirm your email by opening this link:\n\n${url}\n\nThis link expires in 24 hours. If you didn't sign up, ignore this email.`,
    html: layout({
      heading: 'Confirm your email',
      intro: 'Welcome to VaultPay! Please confirm your email address to activate your account.',
      buttonLabel: 'Verify email',
      url,
      note: 'This link expires in 24 hours. If you didn’t create a VaultPay account, you can safely ignore this email.',
    }),
  });
};

export const sendPasswordResetEmail = ({ to, token }) => {
  const url = `${env.WEB_APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
  return send({
    to,
    subject: 'Reset your VaultPay password',
    text: `Reset your VaultPay password by opening this link:\n\n${url}\n\nThis link expires in 30 minutes. If you didn't request this, ignore this email.`,
    html: layout({
      heading: 'Reset your password',
      intro: 'We received a request to reset your VaultPay password. Click below to choose a new one.',
      buttonLabel: 'Reset password',
      url,
      note: 'This link expires in 30 minutes. If you didn’t request a password reset, you can safely ignore this email.',
    }),
  });
};
