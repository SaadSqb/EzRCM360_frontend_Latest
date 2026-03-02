import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";

export default function HelpPage() {
  return (
    <PageShell
      title="Help & Support"
      description="Documentation and support resources for EzRCM360."
    >
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Coming Soon</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Documentation and support resources will be available here. Check back for guides, FAQs, and contact information.
          </p>
        </div>
      </Card>
    </PageShell>
  );
}
