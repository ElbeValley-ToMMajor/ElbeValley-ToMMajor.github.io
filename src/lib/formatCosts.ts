/**
 * Formats a costs string with German thousands separators and EUR suffix.
 * Handles raw numbers ("1000000"), already-formatted values ("1.000"),
 * mixed formats ("50,000 EUR"), and non-numeric strings ("Minimal").
 */
export function formatCosts(raw: string): string {
  if (!raw) return raw;
  // Strip spaces, dots (thousands sep), commas, and known currency words to isolate digits
  const digits = raw.replace(/[\s.,]/g, "").replace(/[^0-9]/g, "");
  if (!digits) return raw; // purely non-numeric (e.g. "Minimal")
  const num = parseInt(digits, 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("de-DE") + " EUR";
}
