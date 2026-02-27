"use client";

import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageShellProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Optional actions (e.g. Add button) */
  actions?: React.ReactNode;
  className?: string;
}

/** Consistent page layout with breadcrumbs, title, optional description and actions. */
export function PageShell({
  breadcrumbs,
  title,
  description,
  children,
  actions,
  className = "",
}: PageShellProps) {
  return (
    <div className={`animate-fade-in ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-slate-300" aria-hidden>
                  /
                </span>
              )}
              {b.href ? (
                <Link
                  href={b.href}
                  className="transition-colors hover:text-primary-600 hover:underline"
                >
                  {b.label}
                </Link>
              ) : (
                <span className="text-slate-700">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title row - generous spacing */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-base text-slate-600">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      {children}
    </div>
  );
}
