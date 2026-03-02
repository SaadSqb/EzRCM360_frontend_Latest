import Link from "next/link";

export interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
}

export function PageHeader({
  title,
  description,
  backHref = "/settings",
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <nav className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        <Link href={backHref} className="transition-colors hover:text-primary-600 hover:underline">
          Settings & Configurations
        </Link>
        <span className="text-slate-300" aria-hidden>/</span>
        <span className="text-slate-700">{title}</span>
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-base text-slate-600">{description}</p>
      )}
    </div>
  );
}
