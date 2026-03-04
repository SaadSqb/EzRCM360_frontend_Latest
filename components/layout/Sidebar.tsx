"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissionsOptional } from "@/lib/contexts/PermissionsContext";
import { useSidebar } from "@/lib/contexts/SidebarContext";
import Image from "next/image";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ChevronDownIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "@/lib/icons/AppIcons";
import { getApiUrl } from "@/lib/api";
import { profileApi } from "@/lib/services/profile";

const iconClass = "h-5 w-5 shrink-0";

const DashboardIcon = () => (
  <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const PatientsIcon = () => (
  <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ClaimsIcon = () => (
  <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChartIcon = () => (
  <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HelpIcon = () => (
  <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const mainNav: { href: string; label: string; moduleName: string; icon: React.ReactNode }[] = [
  { href: "/dashboard", label: "Dashboard", moduleName: "Dashboard", icon: <DashboardIcon /> },
  { href: "/patients", label: "Patients", moduleName: "Patients", icon: <PatientsIcon /> },
  { href: "/claims", label: "Claims", moduleName: "Claims", icon: <ClaimsIcon /> },
];

const rcmSubItems: { href: string; label: string; moduleName: string }[] = [
  { href: "/rcm/insurance-ar-analysis", label: "Insurance AR Analysis", moduleName: "Insurance AR Analysis" },
];

export function Sidebar() {
  const pathname = usePathname();
  const permissions = usePermissionsOptional();
  const { collapsed, toggle } = useSidebar();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [rcmOpen, setRcmOpen] = useState(true);
  const isSettings = pathname?.startsWith("/settings");
  const isRcm = pathname?.startsWith("/rcm");
  useEffect(() => {
    profileApi()
      .getMe()
      .then((p) => {
        setUserName(p.userName);
        setUserEmail(p.email);
        setProfilePictureUrl(p.profilePictureUrl ?? null);
      })
      .catch(() => {
        setUserName(null);
        setUserEmail(null);
        setProfilePictureUrl(null);
      });
  }, [pathname]);

  /** Fail-secure: only show nav items user explicitly has canView for. */
  const canView = (moduleName: string) =>
    permissions && !permissions.loading && permissions.canView(moduleName);

  const visibleMain = mainNav.filter((item) => canView(item.moduleName));
  const visibleRcm = rcmSubItems.filter((item) => canView(item.moduleName));

  const navLinkClass = (active: boolean) =>
    `sidebar-item-text flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-3 text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-sidebar-accent text-primary"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
    } ${collapsed ? "justify-center px-2" : ""}`;

  const subLinkClass = (active: boolean) =>
    `sidebar-item-text flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-sidebar-accent text-primary"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
    } ${collapsed ? "justify-center pl-3 pr-2" : "pl-9 pr-3"}`;

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-full flex-col border-r border-sidebar-border bg-sidebar shadow-[var(--shadow-sidebar)] transition-[width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo / Brand + Toggle */}
      <div className={`flex h-14 shrink-0 items-center border-b border-sidebar-border ${collapsed ? "justify-center px-0" : "justify-between gap-2 px-3"}`}>
        <div className={`flex min-w-0 items-center ${collapsed ? "justify-center" : "flex-1 gap-3"}`}>
          <Image src="/logo.png" alt="EzRCM360" width={147} height={32} className={`shrink-0 ${collapsed ? "h-8 w-auto" : "h-9 w-auto"}`} priority />
          {!collapsed && <span className="truncate font-semibold tracking-tight text-foreground">EzRCM360</span>}
        </div>
        {!collapsed && (
          <button
            type="button"
            onClick={toggle}
            className="rounded-md p-1.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-primary focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-1"
            aria-label="Collapse sidebar"
          >
            <PanelLeftCloseIcon />
          </button>
        )}
      </div>
      {collapsed && (
        <div className="flex shrink-0 justify-center border-b border-sidebar-border py-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded-md p-1.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-primary focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-1"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpenIcon />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-3">
          {visibleMain.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href} className={navLinkClass(isActive)} title={collapsed ? item.label : undefined}>
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}

          {/* RCM Intelligence - expandable */}
          {visibleRcm.length > 0 && (
            <li>
              {collapsed ? (
                <Link
                  href={visibleRcm[0].href}
                  className={navLinkClass(pathname?.startsWith(visibleRcm[0].href) ?? false)}
                  title="RCM Intelligence"
                >
                  <ChartIcon />
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setRcmOpen(!rcmOpen)}
                    className={`w-full ${navLinkClass(false)}`}
                    aria-expanded={rcmOpen}
                  >
                    <ChartIcon />
                    <span className="flex-1 text-left">RCM Intelligence</span>
                    <ChevronDownIcon open={rcmOpen} />
                  </button>
                  {rcmOpen && (
                    <ul className="mt-1 space-y-0.5">
                      {visibleRcm.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        return (
                          <li key={item.href}>
                            <Link href={item.href} className={subLinkClass(isActive)}>
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </li>
          )}

          {/* Settings & Configurations */}
          {canView("Settings & Configurations") && (
            <li>
              <Link href="/settings" className={navLinkClass(isSettings)} title={collapsed ? "Settings & Configurations" : undefined}>
                <SettingsIcon />
                {!collapsed && <span>Settings & Configurations</span>}
              </Link>
            </li>
          )}

          {/* Help & Support */}
          <li>
            <Link href="/help" className={navLinkClass(pathname === "/help")} title={collapsed ? "Help & Support" : undefined}>
              <HelpIcon />
              {!collapsed && <span>Help & Support</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* User section */}
      <div className={`shrink-0 border-t border-sidebar-border ${collapsed ? "p-2" : "p-3"}`}>
        <Link
          href="/profile/edit"
          className={`flex items-center rounded-lg py-2 transition-all duration-200 hover:bg-sidebar-accent/50 ${collapsed ? "justify-center px-0" : "gap-3 px-3"}`}
          title={collapsed ? (userName ?? "Profile") : undefined}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-primary">
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl.startsWith("http") ? profilePictureUrl : getApiUrl("/api/files/" + profilePictureUrl)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              (userName || userEmail || "U")[0].toUpperCase()
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{userName ?? "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{userEmail ?? "—"}</p>
            </div>
          )}
        </Link>
        <LogoutButton className={`mt-2 flex w-full items-center justify-center rounded-lg bg-sidebar-accent px-3 py-3 text-sm font-medium text-sidebar-primary transition-colors hover:bg-sidebar-accent/80 ${collapsed ? "px-2" : ""}`} />
      </div>
    </aside>
  );
}
