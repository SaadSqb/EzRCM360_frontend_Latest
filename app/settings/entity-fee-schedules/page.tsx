import { PageShell } from "@/components/layout/PageShell";
import { ComingSoonCard } from "@/components/ui/ComingSoonCard";

export default function EntityFeeSchedulesPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "Settings & Configurations", href: "/settings" }, { label: "Entity Billable Fee Schedules" }]}
      title="Entity Billable Fee Schedules"
      description="Entity-level fee schedule assignments."
    >
      <ComingSoonCard
        icon={
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Entity fee schedules"
        description="This section will be available in a future update."
        iconBg="from-teal-100 to-teal-200"
      />
    </PageShell>
  );
}
