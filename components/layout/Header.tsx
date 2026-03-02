"use client";

import { usePathname } from "next/navigation";

function getHeaderTitle(pathname: string | null): string {
  if (!pathname) return "Dashboard";
  if (pathname.startsWith("/rcm/insurance-ar-analysis")) return "Insurance AR Analysis";
  if (pathname.startsWith("/rcm")) return "RCM Intelligence";
  if (pathname.startsWith("/settings")) return "Settings & Configurations";
  if (pathname.startsWith("/dashboard") || pathname === "/") return "Dashboard";
  if (pathname.startsWith("/patients")) return "Patients";
  if (pathname.startsWith("/claims")) return "Claims";
  if (pathname.startsWith("/help")) return "Help & Support";
  if (pathname.startsWith("/profile")) return "Edit Profile";
  return "Dashboard";
}

export function Header() {
  const pathname = usePathname();
  const title = getHeaderTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-[3.5rem] shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/90 px-6 shadow-[var(--shadow-header)] backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tracking-tight text-slate-700">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="relative rounded-lg p-2.5 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-1"
          aria-label="Notifications"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 6H9"
            />
          </svg>
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
