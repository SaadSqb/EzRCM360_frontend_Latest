"use client";

import { cn } from "@/lib/utils";

export interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function Label({
  children,
  htmlFor,
  required,
  className = "",
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "font-aileron font-normal text-[14px] leading-none text-[#2A2C33]",
        className,
      )}
    >
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}
