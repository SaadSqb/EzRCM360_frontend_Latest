"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/api";
import { LogoIcon } from "@/lib/icons/LogoIcon";
import { useToast } from "@/lib/contexts/ToastContext";
import { RightArrow } from "@/lib/icons/RightArrow";
import Image from "next/image";

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
      const token = data.data?.accessToken ?? data.accessToken;
      const refresh = data.data?.refreshToken ?? data.refreshToken;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
        if (refresh) localStorage.setItem("refreshToken", refresh);
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
        <div className="mb-6">
          <LogoIcon size={140} />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Login to your account</h1>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#202830]">
              Email <span className="text-red-500">*</span>
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
            <label htmlFor="password" className="block text-sm font-semibold text-[#202830]">
              Password <span className="text-red-500">*</span>
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
            <span className="mr-1">{loading ? "Logging in…" : "Login"}</span> <RightArrow size={16} />
          </Button>
        </form>
      </Card>
    </div>
  );
}
