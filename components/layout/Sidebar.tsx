"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissionsOptional } from "@/lib/contexts/PermissionsContext";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { profileApi } from "@/lib/services/profile";

const mainNav: { href: string; label: string; moduleName: string }[] = [
  { href: "/dashboard", label: "Dashboard", moduleName: "Dashboard" },
  { href: "/patients", label: "Patients", moduleName: "Patients" },
  { href: "/claims", label: "Claims", moduleName: "Claims" },
  { href: "/settings", label: "Settings & Configurations", moduleName: "Settings & Configurations" },
];

export function Sidebar() {
  const pathname = usePathname();
  const permissions = usePermissionsOptional();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const isSettings = pathname?.startsWith("/settings");

  useEffect(() => {
    profileApi()
      .getMe()
      .then((p) => {
        setUserName(p.userName);
        setUserEmail(p.email);
      })
      .catch(() => {
        setUserName(null);
        setUserEmail(null);
      });
  }, []);
  // Show full nav when no provider, still loading, or no permissions (e.g. API failed) so the page is never blank
  const visibleNav =
    !permissions || permissions.loading || permissions.permissions.length === 0
      ? mainNav
      : mainNav.filter((item) => permissions.canView(item.moduleName));

  return (
    <aside className="fixed left-0 top-0 z-30 h-full w-64 border-r border-slate-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-600 text-white font-semibold">
            E
          </div>
          <span className="font-semibold text-slate-800">EzRCM360</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                (item.href === "/settings" && isSettings) || pathname === item.href
                  ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600">
              {(userName || userEmail || "U")[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{userName ?? "User"}</p>
              <p className="truncate text-xs text-slate-500">{userEmail ?? "—"}</p>
            </div>
          </div>
          <LogoutButton className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100" />
        </div>
      </div>
    </aside>
  );
}
