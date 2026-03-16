import { PageShell } from "@/components/layout/PageShell";

export default function TermsOfServicePage() {
  return (
    <PageShell title="Terms of Service">
      <div className="max-w-3xl space-y-4 text-sm text-[#334155]">
        <p>
          This is a placeholder Terms of Service page for EzRCM360. The content on this page
          is for development and testing only.
        </p>
        <p>
          In a production environment, this page will describe the legal terms that govern
          use of the EzRCM360 application, including acceptable use, account responsibilities,
          limitations of liability, and other contractual details.
        </p>
      </div>
    </PageShell>
  );
}

