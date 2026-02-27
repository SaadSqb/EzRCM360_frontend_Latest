"use client";

import { Label } from "./Label";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
  inputClassName?: string;
}

const inputBaseClass =
  "input-enterprise";

export function Input({
  label,
  error,
  wrapperClassName = "",
  inputClassName = "",
  id,
  required,
  ...rest
}: InputProps) {
  const inputId = id ?? (label && typeof label === "string" ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  return (
    <div className={wrapperClassName}>
      {label != null && (
        <Label htmlFor={inputId} required={required} className="mb-1">
          {label}
        </Label>
      )}
      <input
        id={inputId}
        className={`${inputBaseClass} ${error ? "input-enterprise-error" : ""} ${inputClassName}`}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={inputId ? `${inputId}-error` : undefined} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
