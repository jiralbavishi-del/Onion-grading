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

export const INDIAN_STATES = [
  "Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat", "Rajasthan",
  "Bihar", "Andhra Pradesh", "Telangana", "Haryana", "Uttar Pradesh",
  "West Bengal", "Tamil Nadu", "Odisha", "Punjab",
];

export const VARIETIES = [
  "Nashik Red", "Pune Red / Alibag", "Bellary Red", "Bangalore Rose",
  "Agrifound Dark Red", "Agrifound Light Red", "Pusa Red",
  "Pusa White Round", "Pusa Madhavi", "White Onion (Local)",
  "Yellow Granex", "Red Creole", "Other",
];

export const GRADES = [
  { id: "A", label: "Grade A", tag: "Premium", desc: "Uniform bulbs, firm, minimal defects" },
  { id: "B", label: "Grade B", tag: "Standard", desc: "Fair uniformity, moderate defects" },
  { id: "C", label: "Grade C", tag: "Processing", desc: "Irregular size, high defect tolerance" },
];

export const SIZE_CLASSES = [
  { id: "S", label: "Small", range: "< 35 mm" },
  { id: "M", label: "Medium", range: "35–55 mm" },
  { id: "L", label: "Large", range: "55–70 mm" },
  { id: "J", label: "Jumbo", range: "> 70 mm" },
];

export const PACKAGING = ["Mesh bag", "Jute bag", "Loose / bulk", "Crate"];
export const SKIN_TONES = ["Uniform coppery-red", "Light golden", "Mixed tones", "Pale / bleached"];
export const FIRMNESS = ["Firm", "Medium", "Soft"];

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const batchId = () => "OA-" + Date.now().toString().slice(-8);

export const initialForm = {
  state: "", city: "", market: "", farmerName: "", farmerContact: "",
  collectorName: "", collectionDate: todayISO(),
  variety: "", grade: "", sizeClass: "", quantity: "", packaging: "",
  moisture: "", skinTone: "", firmness: "", sprouting: "", damage: "", doubles: "",
  notes: "",
};

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

