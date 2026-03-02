import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";

export default function NsaEligibilityPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "Settings & Configurations", href: "/settings" }, { label: "NSA Eligibility Rules" }]}
      title="NSA Eligibility Rules"
      description="NSA eligibility governance."
    >
      <Card className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">Coming soon</p>
        <p className="mt-1 text-xs text-slate-500">This section will be available in a future update.</p>
      </Card>
    </PageShell>
  );
}
