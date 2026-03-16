import { PageShell } from "@/components/layout/PageShell";

export default function ComplianceDisclaimerPage() {
  return (
    <PageShell title="Compliance Disclaimer">
      <div className="max-w-3xl space-y-4 text-sm text-[#334155]">
        <p>
          This is a placeholder Compliance Disclaimer page for EzRCM360. The content on this
          page is for development and testing only.
        </p>
        <p>
          In a production environment, this page will describe regulatory and compliance
          considerations, including but not limited to HIPAA, data retention, audit logging,
          and responsibilities of organizations using the platform.
        </p>
      </div>
    </PageShell>
  );
}

