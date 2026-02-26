import { API_URL } from "@/lib/env";

export function getApiUrl(path: string): string {
  const base = API_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
