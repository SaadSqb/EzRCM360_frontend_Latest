"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  MFA_USER_ID_KEY,
  MFA_SETUP_USER_ID_KEY,
  MFA_VERIFIED_KEY,
} from "@/lib/env";
import { getApiUrl } from "@/lib/api";

/**
 * Logout button that clears auth state and redirects to login.
 * Calls backend logout API to revoke tokens, then clears local storage.
 */
export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (token) {
      try {
        await fetch(getApiUrl("/api/Auth/logout"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // Ignore - clear storage anyway
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(MFA_USER_ID_KEY);
      sessionStorage.removeItem(MFA_SETUP_USER_ID_KEY);
      sessionStorage.removeItem(MFA_VERIFIED_KEY);
    }
    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className}
    >
      Logout
    </button>
  );
}
