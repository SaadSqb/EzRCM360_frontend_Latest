import { PageShell } from "@/components/layout/PageShell";
import { ComingSoonCard } from "@/components/ui/ComingSoonCard";

export default function HelpPage() {
  return (
    <PageShell
      title="Help & Support"
      description="Documentation and support resources for EzRCM360."
    >
      <ComingSoonCard
        icon={
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Documentation & support"
        description="Documentation and support resources will be available here. Check back for guides, FAQs, and contact information."
        iconBg="from-primary-100 to-primary-200"
      />
    </PageShell>
  );
}
