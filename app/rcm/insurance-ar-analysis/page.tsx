"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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

export default function InsuranceArAnalysisListPage() {
  const router = useRouter();
  const toast = useToast();
  const api = insuranceArAnalysisApi();
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
    ? [...new Set(data.items.map((r) => r.uploadedBy))].filter(Boolean).sort()
    : [];
  const displayedItems = uploadedBy ? data?.items.filter((r) => r.uploadedBy === uploadedBy) ?? [] : data?.items ?? [];

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

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          <Link href="/rcm/insurance-ar-analysis" className="hover:text-neutral-700">
            INSURANCE AR ANALYSIS
          </Link>
        </p>
        <h1 className="mt-2 text-xl font-semibold text-neutral-900">Insurance AR Analysis</h1>
      </div>

      <Card className="animate-fade-in-up">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <select
              value={uploadedBy}
              onChange={(e) => {
                setUploadedBy(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Uploaded By: All</option>
              {uniqueUploadedBy.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <div className="relative max-w-xs flex-1">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-neutral-200 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleDownloadTemplate}
              disabled={downloading}
            >
              {downloading ? "Downloading…" : "Download AR Intake Template →"}
            </Button>
            <Button onClick={handleUploadData}>Upload Data →</Button>
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {data && (
          <>
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
                    <TableCell colSpan={5} className="text-center text-sm text-neutral-500">
                      No sessions found. Click &quot;Upload Data&quot; to create one.
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
                      <TableCell className="font-medium text-primary-600">
                        {row.sessionName}
                      </TableCell>
                      <TableCell>{row.uploadedBy}</TableCell>
                      <TableCell>{formatDate(row.uploadedAt)}</TableCell>
                      <TableCell>{row.sourceType}</TableCell>
                      <TableCell align="right">
                        {row.sessionStatus === "Completed" ? (
                          <Link
                            href={`/rcm/insurance-ar-analysis/${row.id}/report`}
                            className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                          >
                            View Report
                          </Link>
                        ) : ["Processing", "ConflictResolution", "EnrichmentPending", "PmUploaded", "ValidationCompleted"].includes(
                            row.sessionStatus
                          ) ? (
                          <Link
                            href={`/rcm/insurance-ar-analysis/${row.id}/processing`}
                            className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                          >
                            View Progress
                          </Link>
                        ) : (
                          <span className="text-sm text-neutral-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t border-neutral-200 pt-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <p className="text-sm text-neutral-600">
                  Result(s): {String(displayedItems.length).padStart(2, "0")}/{String(data.totalCount).padStart(2, "0")}
                </p>
                <span className="text-sm text-neutral-500">Show per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-md border border-neutral-200 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {[5, 10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
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
    </div>
  );
}
