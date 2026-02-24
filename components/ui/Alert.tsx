"use client";

export type AlertVariant = "error" | "success" | "info";

export interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: "bg-red-50 text-red-700",
  success: "bg-green-50 text-green-700",
  info: "bg-slate-50 text-slate-700",
};

export function Alert({ children, variant = "error", className = "" }: AlertProps) {
  return (
    <div
      className={`rounded-lg px-3 py-2 text-sm ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
