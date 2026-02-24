/** Format ISO date string for use in <input type="date"> (YYYY-MM-DD) */
export function toDateInput(value: string | null | undefined): string {
  if (!value) return "";
  try {
    const d = new Date(value);
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}
