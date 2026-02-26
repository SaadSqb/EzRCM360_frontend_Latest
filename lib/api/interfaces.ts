/**
 * HTTP client abstraction (Dependency Inversion Principle).
 * Services depend on this interface, not concrete implementation.
 */
export interface IHttpClient {
  request<T>(path: string, options?: RequestInit): Promise<T>;
}
