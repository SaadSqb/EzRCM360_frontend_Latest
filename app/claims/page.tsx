import { PageShell } from "@/components/layout/PageShell";
import { ComingSoonCard } from "@/components/ui/ComingSoonCard";

export default function ClaimsPage() {
  return (
    <PageShell
      title="Claims"
      description="Manage and track claims across the revenue cycle."
    >
      <ComingSoonCard
        icon={
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title="Claims management"
        description="Claims management, submission, and tracking will be available here. Check back for claim status, corrections, and reporting."
        iconBg="from-amber-100 to-amber-200"
      />
    </PageShell>
  );
}
