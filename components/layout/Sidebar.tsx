"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissionsOptional } from "@/lib/contexts/PermissionsContext";

const mainNav: { href: string; label: string; moduleName: string }[] = [
  { href: "/dashboard", label: "Dashboard", moduleName: "Dashboard" },
  { href: "/patients", label: "Patients", moduleName: "Patients" },
  { href: "/claims", label: "Claims", moduleName: "Claims" },
  { href: "/settings", label: "Settings & Configurations", moduleName: "Settings & Configurations" },
];

export function Sidebar() {
  const pathname = usePathname();
  const permissions = usePermissionsOptional();
  const isSettings = pathname?.startsWith("/settings");
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
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">User</p>
              <p className="truncate text-xs text-slate-500">user@example.com</p>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-2 flex items-center justify-center rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
          >
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}
