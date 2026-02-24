import Link from "next/link";

export function PageHeader({
  title,
  description,
  backHref = "/settings",
}: {
  title: string;
  description?: string;
  backHref?: string;
}) {
  return (
    <div className="mb-6">
      <Link
        href={backHref}
        className="text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        ← Settings & Configurations
      </Link>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      )}
    </div>
  );
}
