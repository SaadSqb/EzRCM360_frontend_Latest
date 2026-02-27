/**
 * Centralized environment configuration for EzRCM360.
 *
 * Environment detection (use one of these):
 * - NODE_ENV: 'production' (npm run build && start) → production defaults
 * - NODE_ENV: 'development' (npm run dev) → local defaults
 * - NEXT_PUBLIC_APP_ENV: 'production' | 'local' → explicit override
 *
 * Override any value via .env.local (for local) or deployment env vars (for production).
 */

const explicitEnv = process.env.NEXT_PUBLIC_APP_ENV;
const isProduction =
  explicitEnv === "production" ||
  (explicitEnv !== "local" && process.env.NODE_ENV === "production");

/** API base URL (no trailing slash). When not set, defaults to local API for local dev. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://localhost:5001";

/** App name shown in UI. */
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "EzRCM360";

/** App URL (for links, redirects, etc.). */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (typeof window !== "undefined" ? window.location.origin : "");

/** localStorage key for access token. */
export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "accessToken";

/** localStorage key for refresh token. */
export const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY ?? "refreshToken";

/** Session storage key for MFA user ID during verify flow. */
export const MFA_USER_ID_KEY = "mfaUserId";

/** Session storage key for MFA setup user ID. */
export const MFA_SETUP_USER_ID_KEY = "mfaSetupUserId";

/** Session storage key for 2FA verified flag. */
export const MFA_VERIFIED_KEY = "is2FaVerified";

/** Cookie name for middleware auth check (set on login, cleared on logout). */
export const AUTH_COOKIE = "ezrcm_signed_in";

/** Whether we're in production. */
export const IS_PRODUCTION = isProduction;

/** Whether we're in development/local. */
export const IS_DEVELOPMENT = !isProduction;
