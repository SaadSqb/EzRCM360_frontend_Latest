/**
 * Global auth callbacks for API layer.
 * Registered by app (e.g. layout/providers) to handle 401/403.
 * Enterprise pattern: consistent handling across all API calls.
 */

export type UnauthorizedCallback = () => void;
export type ForbiddenCallback = (message?: string) => void;

let onUnauthorized: UnauthorizedCallback | null = null;
let onForbidden: ForbiddenCallback | null = null;

export function setOnUnauthorized(cb: UnauthorizedCallback | null): void {
  onUnauthorized = cb;
}

export function setOnForbidden(cb: ForbiddenCallback | null): void {
  onForbidden = cb;
}

export function handle401(): void {
  onUnauthorized?.();
}

export function handle403(message?: string): void {
  onForbidden?.(message);
}
