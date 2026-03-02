import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard" description="Overview and key metrics for EzRCM360.">
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Coming Soon</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Your dashboard with key metrics, charts, and overview will be available here. Check back for activity summaries and insights.
          </p>
        </div>
      </Card>
    </PageShell>
  );
}
