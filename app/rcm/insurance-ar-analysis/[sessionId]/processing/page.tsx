"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
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

const POLL_BASE_MS = 1000; // 1st after 1s, 2nd after 2s, 3rd after 4s, 4th after 8s, 5th after 16s...
const POLL_MAX_MS = 30000; // Cap at 30s

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
  const apiRef = useRef(insuranceArAnalysisApi());

  const [status, setStatus] = useState<ArAnalysisProcessingStatusDto | null>(null);
  const [session, setSession] = useState<ArAnalysisSessionDetailDto | null>(null);
  const [conflictFile, setConflictFile] = useState<File | null>(null);
  const [payerFile, setPayerFile] = useState<File | null>(null);
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [providerFile, setProviderFile] = useState<File | null>(null);
  const [facilityFile, setFacilityFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let pollCount = 0;

    const scheduleNext = () => {
      if (cancelled) return;
      const delay = Math.min(POLL_BASE_MS * Math.pow(2, pollCount), POLL_MAX_MS);
      pollCount += 1;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        fetchStatus();
      }, delay);
    };

    const fetchStatus = async () => {
      if (cancelled) return;
      if (typeof document !== "undefined" && document.hidden) {
        scheduleNext();
        return;
      }
      try {
        const s = await apiRef.current.getStatus(sessionId);
        if (cancelled) return;
        setStatus(s);
        if (s.sessionStatus === "Completed") {
          routerRef.current.push(`/rcm/insurance-ar-analysis/${sessionId}/report`);
          return;
        }
        if (s.sessionStatus === "Failed") return;
        scheduleNext();
      } catch {
        if (!cancelled) scheduleNext();
      }
    };

    const fetchSession = async () => {
      if (cancelled) return;
      try {
        const s = await apiRef.current.getSession(sessionId);
        if (!cancelled) setSession(s);
      } catch {
        /* ignore */
      }
    };

    fetchStatus();
    fetchSession();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sessionId]); // sessionId only - stable deps prevent effect re-runs

  const refreshStatus = useCallback(async () => {
    if (!sessionId) return;
    try {
      const [s, sess] = await Promise.all([
        apiRef.current.getStatus(sessionId),
        apiRef.current.getSession(sessionId),
      ]);
      setStatus(s);
      setSession(sess);
    } catch {
      /* ignore */
    }
  }, [sessionId]);

  const needsResolution = (val: string | null | undefined) =>
    val && /NotFound|Pending|ActionRequired/i.test(val);

  const needsPayerResolution = needsResolution(session?.payerValidationStatus);
  const needsPlanResolution = needsResolution(session?.planValidationStatus);
  const needsProviderResolution = needsResolution(session?.providerParticipationValidationStatus);
  const needsFacilityResolution = needsResolution(session?.facilityParticipationValidationStatus);

  const handleDownloadConflicts = async () => {
    setDownloading(true);
    try {
      const blob = await apiRef.current.downloadClaimIntegrityConflicts(sessionId);
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
      await apiRef.current.uploadClaimIntegrityConflicts(sessionId, conflictFile);
      setConflictFile(null);
      toast.success("Conflict file uploaded.");
      refreshStatus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const createDownloadHandler = (name: string, downloadFn: () => Promise<Blob>, filename: string) => async () => {
    setDownloading(true);
    try {
      const blob = await downloadFn();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${name} file downloaded.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  const createUploadHandler = (name: string, file: File | null, uploadFn: (f: File) => Promise<void>, setFile: (f: File | null) => void) => async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    setUploading(true);
    try {
      await uploadFn(file);
      setFile(null);
      toast.success(`${name} file uploaded.`);
      refreshStatus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadPayer = createDownloadHandler("Payer-NotFound", () => apiRef.current.downloadPayerNotFound(sessionId), "Payer-NotFound.xlsx");
  const handleDownloadPlan = createDownloadHandler("Plan-NotFound", () => apiRef.current.downloadPlanNotFound(sessionId), "Plan-NotFound.xlsx");
  const handleDownloadProvider = createDownloadHandler("Provider participation", () => apiRef.current.downloadProviderParticipationNotFound(sessionId), "ProviderParticipation-NotFound.xlsx");
  const handleDownloadFacility = createDownloadHandler("Facility participation", () => apiRef.current.downloadFacilityParticipationNotFound(sessionId), "FacilityParticipation-NotFound.xlsx");

  const handleUploadPayer = createUploadHandler("Payer-NotFound", payerFile, (f) => apiRef.current.uploadPayerNotFound(sessionId, f), setPayerFile);
  const handleUploadPlan = createUploadHandler("Plan-NotFound", planFile, (f) => apiRef.current.uploadPlanNotFound(sessionId, f), setPlanFile);
  const handleUploadProvider = createUploadHandler("Provider participation", providerFile, (f) => apiRef.current.uploadProviderParticipationNotFound(sessionId, f), setProviderFile);
  const handleUploadFacility = createUploadHandler("Facility participation", facilityFile, (f) => apiRef.current.uploadFacilityParticipationNotFound(sessionId, f), setFacilityFile);

  const ResolutionBlock = ({
    title,
    description,
    downloadLabel,
    filename,
    onDownload,
    onUpload,
    file,
    setFile,
    disabled,
  }: {
    title: string;
    description: string;
    downloadLabel: string;
    filename: string;
    onDownload: () => Promise<void>;
    onUpload: () => Promise<void>;
    file: File | null;
    setFile: (f: File | null) => void;
    disabled: boolean;
  }) => (
    <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
      <h4 className="text-base font-semibold text-amber-900">{title}</h4>
      <p className="mt-2 text-sm text-amber-800">{description}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={onDownload} disabled={disabled} variant="secondary">
          {disabled ? "Downloading…" : downloadLabel}
        </Button>
      </div>
      <div className="mt-6">
        <h5 className="text-sm font-medium text-amber-900">Upload corrected file</h5>
        <div className="mt-2">
          <FileUploadZone
            label={`Drop ${filename} here`}
            hint="XLSX or XLS"
            onFiles={(f) => setFile(f[0] ?? null)}
          />
        </div>
        {file && (
          <Button onClick={onUpload} disabled={uploading} className="mt-3">
            {uploading ? "Uploading…" : "Upload & Continue"}
          </Button>
        )}
      </div>
    </div>
  );

  const needsConflictResolution =
    status?.sessionStatus === "ConflictResolution" ||
    status?.currentStage?.toLowerCase().includes("conflict");

  const isProcessing =
    status?.sessionStatus === "Processing" ||
    (status?.sessionStatus !== "Completed" && status?.sessionStatus !== "Failed");

  return (
    <PageShell
      breadcrumbs={[
        { label: "Insurance AR Analysis", href: "/rcm/insurance-ar-analysis" },
        { label: "Processing" },
      ]}
      title="AR Analysis in Progress"
      description="Your data is being analyzed through our multi-stage validation pipeline."
    >
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
            <div className="mt-8 animate-fade-in-up">
              <h3 className="mb-4 text-base font-semibold text-amber-900">Action required</h3>
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
                <h4 className="text-base font-semibold text-amber-900">Claim integrity conflicts</h4>
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
                  <h5 className="text-sm font-medium text-amber-900">Upload corrected file</h5>
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
            </div>
          )}

          {needsPayerResolution && (
            <div className="mt-8 animate-fade-in-up">
              <h3 className="mb-4 text-base font-semibold text-amber-900">Action required</h3>
              <ResolutionBlock
                title="Payer not found"
                description="Some payers in your intake file were not found. Download the report, map or add the payers, and re-upload to continue."
                downloadLabel="Download Payer-NotFound.xlsx"
                filename="Payer-NotFound.xlsx"
                onDownload={handleDownloadPayer}
                onUpload={handleUploadPayer}
                file={payerFile}
                setFile={setPayerFile}
                disabled={downloading}
              />
            </div>
          )}

          {needsPlanResolution && (
            <div className="mt-8 animate-fade-in-up">
              <h3 className="mb-4 text-base font-semibold text-amber-900">Action required</h3>
              <ResolutionBlock
                title="Plan not found"
                description="Some plans in your intake file were not found. Download the report, map or add the plans, and re-upload to continue."
                downloadLabel="Download Plan-NotFound.xlsx"
                filename="Plan-NotFound.xlsx"
                onDownload={handleDownloadPlan}
                onUpload={handleUploadPlan}
                file={planFile}
                setFile={setPlanFile}
                disabled={downloading}
              />
            </div>
          )}

          {needsProviderResolution && (
            <div className="mt-8 animate-fade-in-up">
              <h3 className="mb-4 text-base font-semibold text-amber-900">Action required</h3>
              <ResolutionBlock
                title="Provider participation not found"
                description="Provider participation could not be resolved for some claims. Download the report, correct the data, and re-upload to continue."
                downloadLabel="Download ProviderParticipation-NotFound.xlsx"
                filename="ProviderParticipation-NotFound.xlsx"
                onDownload={handleDownloadProvider}
                onUpload={handleUploadProvider}
                file={providerFile}
                setFile={setProviderFile}
                disabled={downloading}
              />
            </div>
          )}

          {needsFacilityResolution && (
            <div className="mt-8 animate-fade-in-up">
              <h3 className="mb-4 text-base font-semibold text-amber-900">Action required</h3>
              <ResolutionBlock
                title="Facility participation not found"
                description="Facility participation could not be resolved for some claims. Download the report, correct the data, and re-upload to continue."
                downloadLabel="Download FacilityParticipation-NotFound.xlsx"
                filename="FacilityParticipation-NotFound.xlsx"
                onDownload={handleDownloadFacility}
                onUpload={handleUploadFacility}
                file={facilityFile}
                setFile={setFacilityFile}
                disabled={downloading}
              />
            </div>
          )}
        </div>
      </Card>
    </PageShell>
  );
}
