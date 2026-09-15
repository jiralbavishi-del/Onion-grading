/**
 * Domain constants, configurations, and validation/sanitization helpers
 * for Onion Field Assessment.
 */

export const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB cap
export const MAX_PHONE_LENGTH = 15;
export const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/jpg',
];

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}


/**
 * Clamps numeric input strictly between 0 and 100 in JavaScript.
 * Prevents typed or pasted values exceeding valid percentages.
 * Returns empty string if value is cleared so user can delete/backspace.
 */
export function clampPercent(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  const cleanStr = String(value).trim();
  if (cleanStr === "") return "";

  const parsed = Number(cleanStr);
  if (Number.isNaN(parsed)) {
    return "";
  }
  if (parsed < 0) return 0;
  if (parsed > 100) return 100;

  return Math.round(parsed * 10) / 10;
}

/**
 * Sanitizes supplier contact number field to only allow digits, spaces, `+`, and `-`.
 * Enforces maximum 15 characters cap.
 */
export function sanitizePhone(value) {
  if (value === null || value === undefined) return "";
  const sanitized = String(value).replace(/[^0-9 + -]/g, "").trimStart();
  return sanitized.slice(0, MAX_PHONE_LENGTH);
}

