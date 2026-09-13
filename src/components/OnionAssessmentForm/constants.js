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

export const PRODUCING_STATES = [
  "Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat", "Rajasthan",
  "Bihar", "Andhra Pradesh", "Telangana", "Haryana", "Uttar Pradesh",
  "West Bengal", "Tamil Nadu", "Odisha", "Punjab",
];
export const INDIAN_STATES = PRODUCING_STATES;

export const ONION_VARIETIES = [
  { id: "nashik_red", name: "Nashik Red", type: "Rabi / Storage" },
  { id: "bhima_super", name: "Bhima Super", type: "Kharif / High Yield" },
  { id: "bellary_red", name: "Bellary Red", type: "Southern High Color" },
  { id: "pune_fursungi", name: "Pune Fursungi", type: "Export / Rabi" },
  { id: "bangalore_rose", name: "Bangalore Rose", type: "GI Tag / Export Pickle" },
  { id: "agrifound_dark_red", name: "Agrifound Dark Red", type: "Dark Red / Storage" },
  { id: "pusa_red", name: "Pusa Red", type: "Medium Red / High TSS" },
  { id: "white_onion", name: "White Onion (Dehydration)", type: "Processing / High Solids" },
  { id: "yellow_granex", name: "Yellow Granex", type: "Sweet / Mild" },
  { id: "red_creole", name: "Red Creole", type: "Pungent / Storage" },
  { id: "pusa_white_round", name: "Pusa White Round", type: "White / High Yield" },
  { id: "pusa_madhavi", name: "Pusa Madhavi", type: "Light Red / Medium Storage" },
  { id: "arka_kalyan", name: "Arka Kalyan", type: "Pinkish Red / Kharif" },
  { id: "agrifound_light_red", name: "Agrifound Light Red", type: "Light Red / Rabi" },
  { id: "other", name: "Other", type: "Unspecified" }
];
export const VARIETIES = ONION_VARIETIES.map((v) => v.name);

export const GRADES = [
  {
    id: "Grade A",
    label: "Grade A",
    badge: "Premium Export",
    tag: "Premium",
    color: "onion",
    description: "Uniform shape, tight neck, cured skin, total defects ≤ 5%",
    desc: "Uniform bulbs, firm, minimal defects",
    maxDefectTotal: 5,
  },
  {
    id: "Grade B",
    label: "Grade B",
    badge: "Domestic Standard",
    tag: "Standard",
    color: "amber",
    description: "Acceptable uniformity, slight skin shedding, defects ≤ 10%",
    desc: "Fair uniformity, moderate defects",
    maxDefectTotal: 10,
  },
  {
    id: "Grade C",
    label: "Grade C",
    badge: "Discount / Local",
    tag: "Processing",
    color: "rose",
    description: "Varied caliber, moderate cuts, bolters allowed, defects ≤ 20%",
    desc: "Irregular size, high defect tolerance",
    maxDefectTotal: 20,
  },
  {
    id: "Reject",
    label: "Reject / Culled",
    badge: "Sub-standard",
    tag: "Reject",
    color: "stone",
    description: "Severe rot, heavy sprouting > 12%, unsellable commercial stock",
    desc: "Severe decay or defect load exceeding threshold",
    maxDefectTotal: 100,
  },
];

export const SIZE_CLASSES = [
  { id: "Small", label: "Small (S)", range: "< 35 mm", caliber: "< 35 mm", circleDiameter: 30, mmMin: "30", purpose: "Pickling & domestic soup" },
  { id: "Medium", label: "Medium (M)", range: "35–55 mm", caliber: "35–55 mm", circleDiameter: 42, mmMin: "45", purpose: "Standard household & retail" },
  { id: "Large", label: "Large (L)", range: "55–70 mm", caliber: "55–70 mm", circleDiameter: 54, mmMin: "60", purpose: "Commercial catering & slicing" },
  { id: "Jumbo", label: "Jumbo (XL)", range: "> 70 mm", caliber: "> 70 mm", circleDiameter: 66, mmMin: "75", purpose: "Premium export & processing" },
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

