"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NavigationProgress } from "./NavigationProgress";
import { SidebarProvider, useSidebarOptional } from "@/lib/contexts/SidebarContext";

function MainContent({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebarOptional();
  const collapsed = sidebar?.collapsed ?? false;
  return (
    <div
      className={`flex min-h-screen flex-col transition-[padding] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? "pl-20" : "pl-64"}`}
    >
      <Header />
      <main className="flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <NavigationProgress />
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
