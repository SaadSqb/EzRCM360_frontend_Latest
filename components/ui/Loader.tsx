"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderProps = {
  /** "inline" = minimal height for tables/cards, "page" = centered full-height block */
  variant?: "inline" | "page";
  /** Spinner size */
  size?: "sm" | "md" | "lg";
  /** Optional label below spinner (e.g. "Loading…") */
  label?: string;
  className?: string;
};

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function Loader({
  variant = "inline",
  size = "md",
  label = "Loading…",
  className = "",
}: LoaderProps) {
  const spinner = (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size])}
      role="status"
      aria-label={label}
    />
  );

  if (variant === "page") {
    return (
      <div
        className={cn(
          "flex min-h-[12rem] flex-col items-center justify-center gap-3 py-12",
          className,
        )}
      >
        {spinner}
        {label && (
          <p className="font-aileron text-sm font-medium text-muted-foreground">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-8",
        className,
      )}
    >
      {spinner}
      {label && (
        <p className="font-aileron text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}
