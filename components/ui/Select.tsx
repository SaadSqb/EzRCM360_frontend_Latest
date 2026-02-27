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
  "input-enterprise appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2364748b%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10";

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
        className={`${selectBaseClass} ${error ? "input-enterprise-error" : ""} ${selectClassName}`}
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
