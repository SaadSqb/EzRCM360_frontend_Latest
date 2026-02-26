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
    <div className="mb-6">
      <Link
        href={backHref}
        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
      >
        ← Settings & Configurations
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-neutral-900">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-neutral-600">{description}</p>
      )}
    </div>
  );
}
