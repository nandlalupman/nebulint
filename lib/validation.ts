export class ValidationError extends Error {}

export function text(value: unknown, label: string, max = 500, required = false) {
  if (value != null && typeof value !== "string") throw new ValidationError(`${label} must be text.`);
  const result = typeof value === "string" ? value.trim() : "";
  if (required && !result) throw new ValidationError(`${label} is required.`);
  if (result.length > max) throw new ValidationError(`${label} must be at most ${max} characters.`);
  return result;
}

export function safeUrl(value: unknown, label = "URL", allowRelative = false) {
  const result = text(value, label, 2048);
  if (!result) return "";
  if (allowRelative && /^\/(?!\/|\\)/.test(result) && !/[\\\s]/.test(result)) return result;
  try {
    const url = new URL(result);
    if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) return result;
  } catch { /* Return a field error below. */ }
  throw new ValidationError(`${label} must be a valid http or https URL${allowRelative ? " or a site path" : ""}.`);
}

export function date(value: unknown, label: string, required = false) {
  const result = text(value, label, 10, required);
  if (!result) return null;
  const parsed = new Date(result);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== result) {
    throw new ValidationError(`${label} must be a valid date.`);
  }
  return result;
}

export function choice(value: unknown, options: readonly string[], label: string) {
  if (typeof value !== "string" || !options.includes(value)) throw new ValidationError(`Invalid ${label}.`);
  return value;
}

export function sortOrder(value: unknown) {
  const number = value === undefined ? 100 : Number(value);
  if (!Number.isInteger(number) || Math.abs(number) > 1000000) throw new ValidationError("Order must be an integer between -1000000 and 1000000.");
  return number;
}

export function boolean(value: unknown, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value !== "boolean") throw new ValidationError("Visibility must be true or false.");
  return value;
}

export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ValidationError("A JSON object is required.");
  return value as Record<string, unknown>;
}

export function email(value: unknown) {
  const result = text(value, "Email", 254, true);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new ValidationError("Enter a valid email address.");
  return result;
}
