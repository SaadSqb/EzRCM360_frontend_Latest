"use client";

import * as React from "react";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";

interface DrawerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function DrawerForm({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
}: DrawerFormProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
          className={cn(
            "fixed top-0 right-0 z-50 h-screen w-[560px] bg-background shadow-2xl flex flex-col",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
            "data-[state=open]:duration-300 data-[state=closed]:duration-200",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            className,
          )}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between flex-shrink-0">
            <DialogPrimitive.Title className="font-aileron font-bold text-[20px] leading-none text-[#2A2C33]">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-6 w-6 text-[#64748B]" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-5 space-y-5 flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
              {footer}
            </div>
          )}

          {/* Hidden description for accessibility */}
          <DialogPrimitive.Description className="sr-only">
            {title} form
          </DialogPrimitive.Description>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
