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
      <nav className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={backHref} className="transition-colors hover:text-primary-600 hover:underline">
          Settings & Configurations
        </Link>
        <span className="text-slate-300" aria-hidden>/</span>
        <span className="text-slate-700">{title}</span>
      </nav>
      <h1 className="font-aileron text-2xl font-bold tracking-tight text-[#202830] sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
