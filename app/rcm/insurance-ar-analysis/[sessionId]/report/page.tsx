"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { useToast } from "@/lib/contexts/ToastContext";
import {
  insuranceArAnalysisApi,
  type ArAnalysisReportDto,
} from "@/lib/services/insuranceArAnalysis";

function formatCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function InsuranceArAnalysisReportPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const toast = useToast();
  const api = insuranceArAnalysisApi();
  const [report, setReport] = useState<ArAnalysisReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    api
      .getReport(sessionId)
      .then(setReport)
      .catch(() => toast.error("Failed to load report."))
      .finally(() => setLoading(false));
  }, [sessionId, api, toast]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await api.downloadReportExport(sessionId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AR_Analysis_Report.xlsx";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report exported.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (s: string) => {
    try {
      return new Date(s).toLocaleString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return s;
    }
  };

  if (loading || !report) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4 py-16">
        <Loader variant="inline" size="lg" label="Loading report…" />
        <p className="text-sm text-neutral-500">Preparing your analysis results</p>
      </div>
    );
  }

  const { analysisSummary, totalClaimsAnalyzed, totalUnderpayment, riskAdjustedRecovery } = report;

  return (
    <PageShell
      breadcrumbs={[
        { label: "Insurance AR Analysis", href: "/rcm/insurance-ar-analysis" },
        { label: `${analysisSummary.practiceName} – ${formatDate(analysisSummary.uploadedAt)}` },
      ]}
      title={analysisSummary.sessionName}
      description={`AR Analysis report for ${analysisSummary.practiceName}`}
      actions={
        <Button onClick={handleExport} disabled={exporting}>
          {exporting ? "Exporting…" : "Export Full Report →"}
        </Button>
      }
    >
      <Card className="mb-6">
        <h3 className="mb-4 text-base font-semibold text-neutral-900">Analysis Summary</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-neutral-500">Session Name</dt>
            <dd className="font-medium">{analysisSummary.sessionName}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Practice Name</dt>
            <dd className="font-medium">{analysisSummary.practiceName}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Uploaded by</dt>
            <dd className="font-medium">{analysisSummary.uploadedBy}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Uploaded at</dt>
            <dd className="font-medium">{formatDate(analysisSummary.uploadedAt)}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Source Type</dt>
            <dd className="font-medium">{analysisSummary.sourceType}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Intake Template File</dt>
            <dd className="font-medium">{analysisSummary.intakeTemplateFile ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">PM Source Report File</dt>
            <dd className="font-medium">
              {analysisSummary.pmSourceReportFiles?.length
                ? analysisSummary.pmSourceReportFiles.join(", ")
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Total Rows</dt>
            <dd className="font-medium">{analysisSummary.totalRows ?? "—"} Rows</dd>
          </div>
        </dl>
      </Card>

      <h3 className="mb-3 text-base font-semibold text-neutral-900">Analysis Report</h3>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card elevated className="animate-fade-in-up [animation-delay:0.05s] [animation-fill-mode:forwards] opacity-0">
          <p className="text-sm font-medium text-neutral-500">Total Claims Analyzed</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">
            {totalClaimsAnalyzed.toLocaleString()}
          </p>
        </Card>
        <Card elevated className="animate-fade-in-up [animation-delay:0.1s] [animation-fill-mode:forwards] opacity-0">
          <p className="text-sm font-medium text-neutral-500">Total Underpayment</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-red-600">
            {formatCurrency(totalUnderpayment)}
          </p>
        </Card>
        <Card elevated className="animate-fade-in-up [animation-delay:0.15s] [animation-fill-mode:forwards] opacity-0">
          <p className="text-sm font-medium text-neutral-500">Risk-Adjusted Recovery</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
            {formatCurrency(riskAdjustedRecovery)}
          </p>
        </Card>
      </div>

      {report.claimCategorisationBreakdown?.length > 0 && (
        <Card className="mb-6">
          <h3 className="mb-4 text-base font-semibold text-neutral-900">
            Claim Categorisation Breakdown
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.claimCategorisationBreakdown.map((item, i) => (
              <div key={i} className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-700">{item.category}</span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {report.underpaymentByPriority?.length > 0 && (
        <Card className="mb-6">
          <h3 className="mb-4 text-base font-semibold text-neutral-900">
            Underpayment Analysis by Priority
          </h3>
          <div className="space-y-2">
            {report.underpaymentByPriority.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-lg px-4 py-2 ${
                  item.priority.toLowerCase().includes("high")
                    ? "bg-red-50"
                    : item.priority.toLowerCase().includes("mid")
                      ? "bg-amber-50"
                      : "bg-blue-50"
                }`}
              >
                <span className="text-sm font-medium">{item.priority}</span>
                <span
                  className={`font-semibold ${
                    item.priority.toLowerCase().includes("high")
                      ? "text-red-700"
                      : item.priority.toLowerCase().includes("mid")
                        ? "text-amber-700"
                        : "text-blue-700"
                  }`}
                >
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {report.recoveryProjectionSummary && (
        <Card>
          <h3 className="mb-4 text-base font-semibold text-neutral-900">
            Recovery Projection Summary
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-sm text-neutral-500">Maximum Potential Recovery (100%)</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">
                {formatCurrency(report.recoveryProjectionSummary.maxPotentialRecovery)}
              </p>
            </div>
            <div className="rounded-lg border-2 border-green-300 bg-green-50 p-4">
              <p className="text-sm text-green-700">
                Risk-Adjusted Recovery
                {report.recoveryProjectionSummary.historicalCollectionRatePct != null &&
                  ` (${report.recoveryProjectionSummary.historicalCollectionRatePct}% Historical)`}
              </p>
              <p className="mt-1 text-xl font-bold text-green-800">
                {formatCurrency(report.recoveryProjectionSummary.riskAdjustedRecovery)}
              </p>
            </div>
          </div>
          {report.recoveryProjectionSummary.historicalCollectionRatePct != null && (
            <p className="mt-3 text-xs text-neutral-500">
              Historical Collection Rate: {report.recoveryProjectionSummary.historicalCollectionRatePct}% (based on 3-year rolling average)
            </p>
          )}
        </Card>
      )}

      {report.contingencyFeeByClaimAge?.length > 0 && (
        <Card className="mt-6">
          <h3 className="mb-4 text-base font-semibold text-neutral-900">
            Contingency Fee Application by Claim Age
          </h3>
          <div className="space-y-2">
            {report.contingencyFeeByClaimAge.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0"
              >
                <span className="text-sm text-neutral-700">
                  {item.ageBand} ({item.feePct}% fee)
                </span>
                <span className="font-medium text-neutral-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageShell>
  );
}
