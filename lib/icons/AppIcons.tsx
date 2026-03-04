"use client";

import React from "react";
import { cn } from "@/lib/utils";

const iconBase = "shrink-0 transition-colors duration-200";

/** Close (X) - modals, toasts, dismiss. Uses currentColor. */
export function CloseIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(iconBase, "h-5 w-5", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/** Chevron down - expand/collapse. */
export function ChevronDownIcon({ className, open, ...props }: React.SVGProps<SVGSVGElement> & { open?: boolean }) {
  return (
    <svg
      className={cn(iconBase, "h-4 w-4", open && "rotate-180", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/** Chevron right - links, expand. */
export function ChevronRightIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(iconBase, "h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

/** Chevron left - back, collapse. */
export function ChevronLeftIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(iconBase, "h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

/** Panel left close - sidebar open → click to collapse. */
export function PanelLeftCloseIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(iconBase, "h-5 w-5", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18M15 15l3-3-3-3" />
    </svg>
  );
}

/** Panel left open - sidebar collapsed → click to expand. */
export function PanelLeftOpenIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(iconBase, "h-5 w-5", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18M12 9l3 3-3 3" />
    </svg>
  );
}

/** Bell - notifications. */
export function BellIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(iconBase, "h-5 w-5", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 6H9" />
    </svg>
  );
}

/** External link. */
export function ExternalLinkIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(iconBase, "h-4 w-4 opacity-70", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
