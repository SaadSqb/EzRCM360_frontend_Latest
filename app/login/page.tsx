"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/api";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, MFA_USER_ID_KEY, MFA_SETUP_USER_ID_KEY } from "@/lib/env";
import { useToast } from "@/lib/contexts/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/Auth/authenticate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.title || "Login failed");

      const payload = data.data ?? data;
      const requiresMfa = payload.requiresMfa === true || payload.RequiresMfa === true;
      const requiresMfaSetup = payload.requiresMfaSetup === true || payload.RequiresMfaSetup === true;
      const userId = payload.userId ?? payload.UserId;

      if (requiresMfa && userId && typeof window !== "undefined") {
        sessionStorage.setItem(MFA_USER_ID_KEY, userId);
        router.push("/authentication/verify");
        router.refresh();
        return;
      }

      const token = payload.accessToken ?? payload.AccessToken ?? data.accessToken;
      const refresh = payload.refreshToken ?? payload.RefreshToken ?? data.refreshToken;

      if (requiresMfaSetup && userId && token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
        sessionStorage.setItem(MFA_SETUP_USER_ID_KEY, userId);
        toast.success("Please set up Multi-Factor Authentication.");
        router.push("/authentication/setup");
        router.refresh();
        return;
      }

      if (token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      }
      toast.success("Signed in successfully.");
      router.push("/settings");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-semibold">
            E
          </div>
          <span className="text-xl font-semibold text-slate-800">EzRCM360</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Sign in</h2>
        <p className="mt-1 text-sm text-slate-600">
          Use your credentials to access the settings portal.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
