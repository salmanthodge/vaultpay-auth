import path from 'node:path';

/** Lowercased file extension including the dot (e.g. ".pdf"). */
export const getExtension = (filename) => path.extname(filename || '').toLowerCase();

/** Strip unsafe characters from a filename before persisting to disk/MinIO. */
export const sanitizeFilename = (filename) =>
  String(filename || '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_');
