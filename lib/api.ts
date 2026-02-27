/**
 * API client for EzRCM360 backend. Re-exports from modular API layer.
 * Uses IHttpClient abstraction for testability (Dependency Inversion).
 */

export {
  apiRequest,
  getApiUrl,
  setHttpClient,
  getHttpClient,
} from "./api/index";
export type { IHttpClient } from "./api/interfaces";
export type { ApiResponse } from "./api/httpClient";

/** Send multipart/form-data. Do not set Content-Type so the browser sets the boundary. */
export async function apiRequestForm(
  path: string,
  formData: FormData,
  method: string = "PUT"
): Promise<void> {
  const { API_URL, AUTH_TOKEN_KEY } = await import("@/lib/env");
  const { handle401, handle403 } = await import("./api/authCallbacks");
  const base = API_URL.replace(/\/$/, "");
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { method, headers, body: formData });
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text) as { message?: string; title?: string; detail?: string };
      message = json.message || json.title || json.detail || text;
    } catch {
      /* use text as-is */
    }
    if (res.status === 401) {
      handle401();
      throw new Error("Your session has expired. Please sign in again.");
    }
    if (res.status === 403) {
      handle403(message);
      throw new Error(message || "You don't have permission to perform this action.");
    }
    throw new Error(message || `HTTP ${res.status}`);
  }
}
