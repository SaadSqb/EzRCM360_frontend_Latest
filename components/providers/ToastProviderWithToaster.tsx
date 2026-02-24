"use client";

import { ToastProvider } from "@/lib/contexts/ToastContext";
import { Toaster } from "@/components/ui/Toaster";

export function ToastProviderWithToaster({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  );
}
