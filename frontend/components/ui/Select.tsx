"use client";

import { Label } from "./Label";

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
}

export interface SelectProps<T = string | number>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className" | "children"> {
  label?: React.ReactNode;
  options: SelectOption<T>[];
  error?: string;
  wrapperClassName?: string;
  selectClassName?: string;
}

const selectBaseClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

export function Select<T extends string | number>({
  label,
  options,
  error,
  wrapperClassName = "",
  selectClassName = "",
  id,
  required,
  ...rest
}: SelectProps<T>) {
  const selectId = id ?? (label && typeof label === "string" ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  return (
    <div className={wrapperClassName}>
      {label != null && (
        <Label htmlFor={selectId} required={required} className="mb-1">
          {label}
        </Label>
      )}
      <select
        id={selectId}
        className={`${selectBaseClass} ${error ? "border-red-500" : ""} ${selectClassName}`}
        required={required}
        aria-invalid={!!error}
        {...rest}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
