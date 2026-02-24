/**
 * API client for EzRCM360 backend. All requests use Bearer token when available.
 */

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001";

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = getBaseUrl().replace(/\/$/, "");
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text) as { message?: string; title?: string };
      message = json.message || json.title || text;
    } catch {
      // use text as-is
    }
    throw new Error(message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const json = (await res.json()) as ApiResponse<T> | T;
    if (json && typeof json === "object" && "data" in json && "success" in json)
      return (json as ApiResponse<T>).data as T;
    return json as T;
  }
  return res.text() as Promise<T>;
}

export function getApiUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Send multipart/form-data. Do not set Content-Type so the browser sets the boundary. */
export async function apiRequestForm(
  path: string,
  formData: FormData,
  method: string = "PUT"
): Promise<void> {
  const base = getBaseUrl().replace(/\/$/, "");
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { method, headers, body: formData });
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text) as { message?: string; title?: string };
      message = json.message || json.title || text;
    } catch {
      // use text as-is
    }
    throw new Error(message || `HTTP ${res.status}`);
  }
}
