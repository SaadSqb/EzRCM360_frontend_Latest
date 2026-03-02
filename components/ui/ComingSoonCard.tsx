import { ContentCard } from "./ContentCard";

export interface ComingSoonCardProps {
  /** Icon - displayed in colored container */
  icon: React.ReactNode;
  /** Main title (e.g. "Coming Soon") */
  title: string;
  /** Supporting description */
  description: string;
  /** Optional icon background gradient */
  iconBg?: string;
  className?: string;
}

/**
 * ComingSoonCard - Microsoft-style card for placeholder/coming soon pages.
 */
export function ComingSoonCard({
  icon,
  title,
  description,
  iconBg = "from-primary-100 to-primary-200",
  className = "",
}: ComingSoonCardProps) {
  return (
    <ContentCard
      icon={icon}
      category="COMING SOON"
      title={title}
      description={description}
      iconBg={iconBg}
      className={className}
    />
  );
}
