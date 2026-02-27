"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  MFA_USER_ID_KEY,
  MFA_SETUP_USER_ID_KEY,
  MFA_VERIFIED_KEY,
  AUTH_COOKIE,
} from "@/lib/env";
import { setOnUnauthorized, setOnForbidden } from "@/lib/api/authCallbacks";
import { useToast } from "@/lib/contexts/ToastContext";

/**
 * Registers global 401/403 handlers for API layer.
 * 401: clears auth state and redirects to login (session expired).
 * 403: shows toast (access denied).
 */
export function ApiAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    setOnUnauthorized(() => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(MFA_USER_ID_KEY);
      sessionStorage.removeItem(MFA_SETUP_USER_ID_KEY);
      sessionStorage.removeItem(MFA_VERIFIED_KEY);
      document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
      toast?.error("Your session has expired. Please sign in again.");
      router.replace("/login");
    });

    setOnForbidden((message) => {
      toast?.error(message ?? "You don't have permission to perform this action.");
    });

    return () => {
      setOnUnauthorized(null);
      setOnForbidden(null);
    };
  }, [router, toast]);

  return <>{children}</>;
}
