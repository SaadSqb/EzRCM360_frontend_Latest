"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/api";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, MFA_USER_ID_KEY, MFA_VERIFIED_KEY } from "@/lib/env";
import { useToast } from "@/lib/contexts/ToastContext";

export default function MfaVerifyPage() {
  const router = useRouter();
  const toast = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const userId = sessionStorage.getItem(MFA_USER_ID_KEY);
    if (!userId) {
      router.replace("/login");
    }
  }, [mounted, router]);

  const handleBackToLogin = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(MFA_USER_ID_KEY);
    }
    router.push("/login");
    router.refresh();
  };

  const handleSendEmailOtp = async () => {
    const userId = typeof window !== "undefined" ? sessionStorage.getItem(MFA_USER_ID_KEY) : null;
    if (!userId) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch(getApiUrl("/api/Auth/mfa/send-email-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { message?: string; title?: string; detail?: string };
        throw new Error(errData.message || errData.title || errData.detail || "Failed to send code");
      }
      toast.success("Verification code sent to your email.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = typeof window !== "undefined" ? sessionStorage.getItem(MFA_USER_ID_KEY) : null;
    if (!userId || !code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/Auth/mfa/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.title || "Verification failed");

      const payload = data.data ?? data;
      const token = payload.accessToken ?? data.accessToken;
      const refresh = payload.refreshToken ?? data.refreshToken;

      if (token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
        sessionStorage.setItem(MFA_VERIFIED_KEY, "true");
        sessionStorage.removeItem(MFA_USER_ID_KEY);
      }

      toast.success("Verification successful.");
      router.push("/settings");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-surface p-4">
      <div className="mb-4 flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-semibold">
            E
          </div>
          <span className="text-xl font-semibold text-slate-800">EzRCM360</span>
        </div>
        <Button variant="secondary" onClick={handleBackToLogin}>
          Back to Login
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold text-slate-900">
          Multi-Factor Authentication Verification
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          For security purposes, please verify your identity using your authenticator app.
          Enter the 6-digit code from your app below.
        </p>

        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          <ol className="list-decimal space-y-1 pl-4">
            <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
            <li>Locate the code for EzRCM360</li>
            <li>Enter the current 6-digit code below</li>
          </ol>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-slate-500">Or</span>
          <button
            type="button"
            onClick={handleSendEmailOtp}
            disabled={sendingOtp || loading}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 underline disabled:opacity-50"
          >
            {sendingOtp ? "Sending…" : "Send code to my email instead"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-[0.5em] shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              autoComplete="one-time-code"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || code.length !== 6}
          >
            {loading ? "Verifying…" : "Verify & Continue"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
