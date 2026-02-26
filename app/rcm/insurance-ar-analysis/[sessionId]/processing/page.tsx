"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FileUploadZone } from "@/components/rcm/FileUploadZone";
import { Loader } from "@/components/ui/Loader";
import { ValidationAnalysisIcon } from "@/components/rcm/ValidationAnalysisIcon";
import { useToast } from "@/lib/contexts/ToastContext";
import {
  insuranceArAnalysisApi,
  type ArAnalysisProcessingStatusDto,
  type ArAnalysisSessionDetailDto,
} from "@/lib/services/insuranceArAnalysis";

const POLL_INTERVAL_MS = 2000;

function PipelineStep({
  step,
  index,
  isLast,
}: {
  step: { name: string; status: string; count?: number | null };
  index: number;
  isLast: boolean;
}) {
  const completed = step.status === "Completed";
  const inProgress = step.status === "InProgress";
  const pending = step.status === "Pending";

  return (
    <div
      className={`flex items-start gap-4 animate-fade-in-up opacity-0 ${
        completed || inProgress ? "opacity-100" : "opacity-60"
      }`}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
            completed
              ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : inProgress
                ? "border-primary-600 bg-primary-50 text-primary-600 ring-4 ring-primary-100 animate-pulse-soft"
                : "border-neutral-200 bg-white text-neutral-400"
          }`}
        >
          {completed ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : inProgress ? (
            <Loader variant="inline" size="sm" />
          ) : (
            <span className="text-sm font-semibold">{index + 1}</span>
          )}
        </div>
        {!isLast && (
          <div
            className={`absolute top-12 left-1/2 h-8 w-0.5 -translate-x-1/2 rounded-full transition-colors duration-500 ${
              completed ? "bg-emerald-400" : "bg-neutral-200"
            }`}
          />
        )}
      </div>
      <div className="flex-1 pt-1 pb-6">
        <p
          className={`text-sm font-medium transition-colors ${
            completed
              ? "text-emerald-700"
              : inProgress
                ? "text-neutral-900"
                : "text-neutral-500"
          }`}
        >
          {step.name}
          {step.count != null ? (
            <span className="ml-1.5 text-neutral-500">({step.count})</span>
          ) : null}
        </p>
        {inProgress && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full w-3/5 rounded-full bg-primary-500 animate-pulse-soft"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function InsuranceArAnalysisProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const toast = useToast();
  const api = insuranceArAnalysisApi();

  const [status, setStatus] = useState<ArAnalysisProcessingStatusDto | null>(null);
  const [session, setSession] = useState<ArAnalysisSessionDetailDto | null>(null);
  const [conflictFile, setConflictFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadStatus = useCallback(async () => {
    if (!sessionId) return;
    try {
      const s = await api.getStatus(sessionId);
      setStatus(s);
      if (s.sessionStatus === "Completed") {
        router.push(`/rcm/insurance-ar-analysis/${sessionId}/report`);
      }
    } catch {
      /* ignore */
    }
  }, [sessionId, api, router]);

  const loadSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      const s = await api.getSession(sessionId);
      setSession(s);
    } catch {
      /* ignore */
    }
  }, [sessionId, api]);

  useEffect(() => {
    loadStatus();
    loadSession();
    const t = setInterval(loadStatus, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [loadStatus, loadSession]);

  const handleDownloadConflicts = async () => {
    setDownloading(true);
    try {
      const blob = await api.downloadClaimIntegrityConflicts(sessionId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ConflictClaims.xlsx";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Conflict file downloaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  const handleUploadConflicts = async () => {
    if (!conflictFile) {
      toast.error("Please select a file.");
      return;
    }
    setUploading(true);
    try {
      await api.uploadClaimIntegrityConflicts(sessionId, conflictFile);
      setConflictFile(null);
      toast.success("Conflict file uploaded.");
      loadStatus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const needsConflictResolution =
    status?.sessionStatus === "ConflictResolution" ||
    status?.currentStage?.toLowerCase().includes("conflict");

  const isProcessing =
    status?.sessionStatus === "Processing" ||
    (status?.sessionStatus !== "Completed" && status?.sessionStatus !== "Failed");

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          <Link href="/rcm/insurance-ar-analysis" className="hover:text-primary-600">
            Insurance AR Analysis
          </Link>
          <span className="mx-1">/</span>
          <span className="text-neutral-600">Processing</span>
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          AR Analysis in Progress
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Your data is being analyzed through our multi-stage validation pipeline.
        </p>
      </div>

      {session && (
        <Card className="mb-6 animate-fade-in-up">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Session Summary
          </h3>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-neutral-500">Uploaded by</dt>
              <dd className="mt-0.5 font-medium text-neutral-900">
                {session.uploadedBy ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Uploaded at</dt>
              <dd className="mt-0.5 font-medium text-neutral-900">
                {session.uploadedAt
                  ? new Date(session.uploadedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Total rows</dt>
              <dd className="mt-0.5 font-medium text-neutral-900">
                {session.totalRows ?? "—"}
              </dd>
            </div>
          </dl>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-50/50 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100">
              <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"
                role="status"
                aria-label="Loading"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                {isProcessing ? "Analyzing your AR data" : status?.overallMessage ?? "Processing"}
              </h2>
              <p className="text-sm text-neutral-600">
                {isProcessing
                  ? "Running validation, enrichment, and recovery calculations. This typically takes 1–3 minutes."
                  : status?.overallMessage}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {!status ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <ValidationAnalysisIcon className="h-20 w-20" />
              <p className="text-sm font-medium text-neutral-700">
                Loading pipeline status…
              </p>
              <p className="text-xs text-neutral-500">
                No errors detected so far.
              </p>
            </div>
          ) : status?.steps && status.steps.length > 0 ? (
            <div className="space-y-0">
              {status.steps.map((s, i) => (
                <PipelineStep
                  key={s.name}
                  step={s}
                  index={i}
                  isLast={i === status.steps.length - 1}
                />
              ))}
            </div>
          ) : null}

          {needsConflictResolution && (
            <div className="mt-8 animate-fade-in-up rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <h3 className="text-base font-semibold text-amber-900">
                Action required
              </h3>
              <p className="mt-2 text-sm text-amber-800">
                We detected claim integrity conflicts. Download the report, correct
                the issues, and re-upload to continue the analysis.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  onClick={handleDownloadConflicts}
                  disabled={downloading}
                  variant="secondary"
                >
                  {downloading ? "Downloading…" : "Download Conflict Claims"}
                </Button>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-amber-900">
                  Upload corrected file
                </h4>
                <div className="mt-2">
                  <FileUploadZone
                    label="Drop corrected file here"
                    hint="XLSX or XLS"
                    onFiles={(f) => setConflictFile(f[0] ?? null)}
                  />
                </div>
                {conflictFile && (
                  <Button
                    onClick={handleUploadConflicts}
                    disabled={uploading}
                    className="mt-3"
                  >
                    {uploading ? "Uploading…" : "Upload & Continue"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
