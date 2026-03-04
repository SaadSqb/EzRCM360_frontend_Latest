"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon } from "@/lib/icons/AppIcons";

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
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="hidden sm:block shrink-0 text-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md" aria-label="EzRCM360 home">
          <Image src="/logo.png" alt="" width={147} height={32} className="h-7 w-auto" />
        </Link>
        <span className="text-sm font-medium tracking-tight text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="relative flex items-center gap-2 rounded-lg p-2.5 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label="Notifications"
        >
          <BellIcon />
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
