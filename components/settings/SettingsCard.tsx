import Link from "next/link";
import { Card } from "@/components/ui/Card";

export interface SettingsLink {
  label: string;
  href: string;
}

export function SettingsCard({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: SettingsLink[];
}) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              <span aria-hidden>→</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
