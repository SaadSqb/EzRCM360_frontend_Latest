"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
import { insuranceArAnalysisApi, type ArAnalysisSessionListItemDto } from "@/lib/services/insuranceArAnalysis";
import { usePaginatedList } from "@/lib/hooks";

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
  const [downloading, setDownloading] = useState(false);

  const { data, error, loading } = usePaginatedList({
    pageNumber: page,
    pageSize,
    fetch: (p) => api.list({ pageNumber: p.pageNumber, pageSize }),
  });

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
      <Card className="overflow-hidden animate-fade-in-up">
        {/* Toolbar with gradient header */}
        <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="uploaded-by" className="text-sm font-medium text-slate-600">Uploaded by</label>
                <select
                  id="uploaded-by"
                  value={uploadedBy}
                  onChange={(e) => {
                    setUploadedBy(e.target.value);
                    setPage(1);
                  }}
                  className="input-enterprise w-auto min-w-[11rem]"
                >
                  <option value="">All</option>
                  {uniqueUploadedBy.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="relative flex-1 min-w-[12rem] max-w-xs">
                <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search sessions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-enterprise pl-10"
                />
              </div>
            </div>
            {canCreate && (
              <div className="flex shrink-0 items-center gap-3">
                <Button variant="secondary" onClick={handleDownloadTemplate} disabled={downloading}>
                  {downloading ? "Downloading…" : "Download Template"}
                </Button>
                <Button onClick={handleUploadData}>Upload Data</Button>
              </div>
            )}
          </div>
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
                  <TableHeaderCell>Uploaded By</TableHeaderCell>
                  <TableHeaderCell>Uploaded At</TableHeaderCell>
                  <TableHeaderCell>Source Type</TableHeaderCell>
                  <TableHeaderCell align="right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center text-sm text-slate-500">
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
                      <TableCell className="font-medium text-slate-900">
                        {row.sessionName}
                      </TableCell>
                      <TableCell>{row.uploadedBy}</TableCell>
                      <TableCell>{formatDate(row.uploadedAt)}</TableCell>
                      <TableCell>{row.sourceType}</TableCell>
                      <TableCell align="right">
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
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/50 px-6 py-4 sm:flex-row">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-700">{displayedItems.length}</span>
                  <span className="text-slate-500"> of </span>
                  <span className="font-medium text-slate-700">{data.totalCount}</span>
                  <span className="text-slate-500"> result{data.totalCount !== 1 ? "s" : ""}</span>
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="per-page" className="text-sm text-slate-500">Per page</label>
                  <select
                    id="per-page"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="input-enterprise w-auto min-w-[4.5rem] px-3 py-1.5 text-sm"
                  >
                  {[5, 10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  disabled={!data.hasPreviousPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={!data.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
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
      </Card>
    </PageShell>
  );
}
