import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";

export interface SettingsLink {
  label: string;
  href: string;
}

/** Matches design Settings.tsx: Card + CardContent, Separator, links with arrow */
export function SettingsCard({
  title,
  description,
  links,
  icon,
  className = "",
}: {
  title: string;
  description: string;
  links: SettingsLink[];
  icon?: string;
  className?: string;
}) {
  return (
    <Card className={cn("flex h-full min-h-0 flex-col border border-border shadow-none", className)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          {icon && (
            <div className="flex-shrink-0">
              <Image src={icon} alt={title} width={20} height={20} className="h-5 w-5" />
            </div>
          )}
          <h3 className="text-base font-semibold text-foreground leading-tight">{title}</h3>
        </div>
        <Separator className="mb-3 -mx-5 w-[calc(100%+2.5rem)]" />
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
        {links.length > 0 && (
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
              >
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
