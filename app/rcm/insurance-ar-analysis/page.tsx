"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { useModulePermission } from "@/lib/contexts/PermissionsContext";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { PageShell } from "@/components/layout/PageShell";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import { Loader } from "@/components/ui/Loader";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/lib/contexts/ToastContext";
import { insuranceArAnalysisApi, type ArAnalysisSessionListItemDto, type ArAnalysisSessionStatus } from "@/lib/services/insuranceArAnalysis";
import { usePaginatedList } from "@/lib/hooks";

const STATUS_OPTIONS: { value: ArAnalysisSessionStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "Draft", label: "Draft" },
  { value: "IntakeUploaded", label: "Intake Uploaded" },
  { value: "ValidationInProgress", label: "Validation In Progress" },
  { value: "ValidationCompleted", label: "Validation Completed" },
  { value: "ValidationFailed", label: "Validation Failed" },
  { value: "PmUploaded", label: "PM Uploaded" },
  { value: "Processing", label: "Processing" },
  { value: "ConflictResolution", label: "Conflict Resolution" },
  { value: "EnrichmentPending", label: "Enrichment Pending" },
  { value: "EnrichmentCompleted", label: "Enrichment Completed" },
  { value: "Completed", label: "Completed" },
  { value: "Failed", label: "Failed" },
];

function formatDate(s: string) {
  try {
    const d = new Date(s);
    return d.toLocaleString(undefined, {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
}

const MODULE_NAME = "Insurance AR Analysis";

export default function InsuranceArAnalysisListPage() {
  const router = useRouter();
  const toast = useToast();
  const api = insuranceArAnalysisApi();
  const { canView, canCreate, loading: permLoading } = useModulePermission(MODULE_NAME);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [uploadedBy, setUploadedBy] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ArAnalysisSessionStatus | "">("");
  const [downloading, setDownloading] = useState(false);

  const { data, error, loading, reload } = usePaginatedList({
    pageNumber: page,
    pageSize,
    fetch: (p) => api.list({ pageNumber: p.pageNumber, pageSize, status: statusFilter || undefined }),
  });

  useEffect(() => {
    setPage(1);
    reload();
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps -- reload refetches with new status

  const uniqueUploadedBy = data
    ? Array.from(new Set(data.items.map((r) => r.uploadedBy))).filter(Boolean).sort()
    : [];

  const displayedItems = (() => {
    let items = uploadedBy ? data?.items.filter((r) => r.uploadedBy === uploadedBy) ?? [] : data?.items ?? [];
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      items = items.filter(
        (r) =>
          r.sessionName?.toLowerCase().includes(term) ||
          r.practiceName?.toLowerCase().includes(term) ||
          r.uploadedBy?.toLowerCase().includes(term) ||
          r.sourceType?.toLowerCase().includes(term)
      );
    }
    return items;
  })();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);


  const handleDownloadTemplate = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await api.downloadIntakeTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AR_Intake_Template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Template downloaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  }, [api, toast]);

  const handleUploadData = () => {
    router.push("/rcm/insurance-ar-analysis/upload");
  };

  if (permLoading) {
    return (
      <PageShell title="Insurance AR Analysis">
        <div className="h-72 animate-shimmer-bg rounded-xl" />
      </PageShell>
    );
  }
  if (!canView) {
    return <AccessDenied moduleName="Insurance AR Analysis" backHref="/dashboard" />;
  }

  return (
    <PageShell
      breadcrumbs={[{ label: "RCM Intelligence", href: "/rcm" }, { label: "Insurance AR Analysis" }]}
      title="Insurance AR Analysis"
      description="Manage AR intake sessions and analyze insurance receivables."
    >
      <div className="animate-fade-in-up">
        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ArAnalysisSessionStatus | "")}
              className="h-10 rounded-[5px] border border-[#E2E8F0] bg-background px-3 font-aileron text-[14px] text-[#202830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value || "_all"} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              id="uploaded-by"
              value={uploadedBy}
              onChange={(e) => {
                setUploadedBy(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-[5px] border border-[#E2E8F0] bg-background px-3 font-aileron text-[14px] text-[#202830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All uploaded by</option>
              {uniqueUploadedBy.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search sessions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-[300px] rounded-[5px] border border-[#E2E8F0] bg-background pl-9 pr-4 font-aileron text-[14px] text-[#202830] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          {canCreate && (
            <div className="flex shrink-0 items-center gap-3">
              <Button variant="outline" onClick={handleDownloadTemplate} disabled={downloading} className="h-10 rounded-[5px] px-[18px] border-[#E2E8F0] font-aileron text-[14px] text-[#2A2C33]">
                {downloading ? "Downloading…" : "Download Template"}
              </Button>
              <Button onClick={handleUploadData} className="h-10 rounded-[5px] px-[18px] bg-[#0066CC] hover:bg-[#0066CC]/90 text-white font-aileron text-[14px]">
                Upload Data
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-6 mt-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {data && (
          <>
            <div className="overflow-hidden px-6 py-2">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Session Name</TableHeaderCell>
                  <TableHeaderCell>Practice Name</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Uploaded By</TableHeaderCell>
                  <TableHeaderCell>Uploaded At</TableHeaderCell>
                  <TableHeaderCell>Source Type</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                      {canCreate
                        ? "No sessions found. Click \"Upload Data\" to create one."
                        : "No sessions found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedItems.map((row: ArAnalysisSessionListItemDto, idx: number) => (
                    <TableRow
                      key={row.id}
                      className="animate-fade-in-up opacity-0"
                      style={{
                        animationDelay: `${Math.min(idx, 7) * 40}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <TableCell>
                        {row.sessionName}
                      </TableCell>
                      <TableCell>{row.practiceName ?? "—"}</TableCell>
                      <TableCell>{row.sessionStatus}</TableCell>
                      <TableCell>{row.uploadedBy}</TableCell>
                      <TableCell>{formatDate(row.uploadedAt)}</TableCell>
                      <TableCell>{row.sourceType}</TableCell>
                      <TableCell>
                        {row.sessionStatus === "Completed" ? (
                          <Link
                            href={`/rcm/insurance-ar-analysis/${row.id}/report`}
                            prefetch={false}
                            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
                          >
                            View Report
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </Link>
                        ) : ["Processing", "ConflictResolution", "EnrichmentPending", "PmUploaded", "ValidationCompleted"].includes(
                            row.sessionStatus
                          ) ? (
                          <Link
                            href={`/rcm/insurance-ar-analysis/${row.id}/processing`}
                            prefetch={false}
                            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
                          >
                            View Progress
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>

            <Pagination
              pageNumber={page}
              totalPages={data.totalPages}
              totalCount={data.totalCount}
              hasPreviousPage={data.hasPreviousPage}
              hasNextPage={data.hasNextPage}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            />
          </>
        )}

        {loading && !data && (
          <div className="animate-fade-in space-y-3 py-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex h-14 items-center gap-4 rounded-lg px-4"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="h-4 w-32 animate-shimmer-bg rounded" />
                <div className="h-4 w-24 animate-shimmer-bg rounded" />
                <div className="h-4 w-28 animate-shimmer-bg rounded" />
                <div className="ml-auto h-4 w-20 animate-shimmer-bg rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
