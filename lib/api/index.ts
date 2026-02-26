/**
 * API layer exports. Uses Dependency Inversion: apiRequest delegates to HttpClient.
 */

import { HttpClient } from "./httpClient";
import type { IHttpClient } from "./interfaces";

// Default instance (can be overridden for testing)
let _client: IHttpClient = new HttpClient();

export function setHttpClient(client: IHttpClient): void {
  _client = client;
}

export function getHttpClient(): IHttpClient {
  return _client;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  return _client.request<T>(path, options);
}

export { getApiUrl } from "./url";
export type { IHttpClient } from "./interfaces";
export { HttpClient } from "./httpClient";
