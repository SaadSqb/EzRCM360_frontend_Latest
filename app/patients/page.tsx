import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";

export default function PatientsPage() {
  return (
    <PageShell title="Patients" description="Manage patient records and demographics.">
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Coming Soon</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Patient management, demographics, and records will be available here. Check back for search, filters, and patient details.
          </p>
        </div>
      </Card>
    </PageShell>
  );
}
