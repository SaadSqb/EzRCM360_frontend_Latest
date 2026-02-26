"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/rcm/Stepper";
import { FileUploadZone } from "@/components/rcm/FileUploadZone";
import { ValidationAnalysisIcon } from "@/components/rcm/ValidationAnalysisIcon";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import { Loader } from "@/components/ui/Loader";
import { useToast } from "@/lib/contexts/ToastContext";
import {
  insuranceArAnalysisApi,
  type ArIntakeValidationResult,
  type ArValidationError,
} from "@/lib/services/insuranceArAnalysis";

type Step = 1 | 2 | 3;

export default function InsuranceArAnalysisUploadPage() {
  const router = useRouter();
  const toast = useToast();
  const api = insuranceArAnalysisApi();

  const [step, setStep] = useState<Step>(1);
  const [practiceName, setPracticeName] = useState("");
  const [intakeFile, setIntakeFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ArIntakeValidationResult | null>(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [pmFiles, setPmFiles] = useState<File[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sessionDetail, setSessionDetail] = useState<{
    sessionName: string;
    practiceName: string;
    uploadedBy?: string;
    uploadedAt: string;
    sourceType: string;
    intakeTemplateFile?: string;
    pmSourceReportFiles: string[];
    totalRows?: number;
  } | null>(null);

  const steps = [
    { id: 1, label: "Practice/Upload AR Intake", completed: step > 1, active: step === 1 },
    { id: 2, label: "Upload PM Report(s)", completed: step > 2, active: step === 2 },
    { id: 3, label: "Process", completed: false, active: step === 3 },
  ];

  const handleCreateSession = useCallback(async () => {
    if (!practiceName.trim()) {
      toast.error("Practice name is required.");
      return;
    }
    if (!intakeFile) {
      toast.error("Please upload an AR intake file.");
      return;
    }
    setSubmitLoading(true);
    setValidationLoading(true);
    setValidationResult(null);
    try {
      if (sessionId) {
        const vr = await api.uploadIntake(sessionId, intakeFile, "Full");
        setValidationResult(vr);
        toast.success("Intake re-uploaded and validated.");
      } else {
        const result = await api.createSession({
          practiceName: practiceName.trim(),
          sourceType: "ExcelIntake",
          intakeFile,
          validationScope: "Full",
        });
        setSessionId(result.sessionId);
        setValidationResult(result.validationResult ?? null);
        toast.success("Session created.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create session.");
    } finally {
      setSubmitLoading(false);
      setValidationLoading(false);
    }
  }, [practiceName, intakeFile, sessionId, api, toast]);

  const canProceedFromStep1 =
    !!sessionId &&
    validationResult?.success === true &&
    !validationLoading;

  const handleNextFromStep1 = () => {
    if (canProceedFromStep1) setStep(2);
  };

  const handleUploadPmReports = useCallback(async () => {
    if (!sessionId || pmFiles.length === 0) {
      toast.error("Please upload at least one PM report.");
      return;
    }
    setSubmitLoading(true);
    try {
      await api.uploadPmReports(sessionId, pmFiles);
      toast.success("PM reports uploaded.");
      setStep(3);
      const detail = await api.getSession(sessionId);
      setSessionDetail({
        sessionName: detail.sessionName,
        practiceName: detail.practiceName,
        uploadedBy: detail.uploadedBy ?? undefined,
        uploadedAt: detail.uploadedAt,
        sourceType: detail.sourceType,
        intakeTemplateFile: detail.intakeTemplateFile ?? undefined,
        pmSourceReportFiles: detail.pmSourceReportFiles ?? [],
        totalRows: detail.totalRows ?? undefined,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload.");
    } finally {
      setSubmitLoading(false);
    }
  }, [sessionId, pmFiles, api, toast]);

  const handleStartAnalysis = useCallback(async () => {
    if (!sessionId) return;
    setSubmitLoading(true);
    try {
      await api.startAnalysis(sessionId);
      toast.success("AR Analysis started.");
      router.push(`/rcm/insurance-ar-analysis/${sessionId}/processing`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start.");
    } finally {
      setSubmitLoading(false);
    }
  }, [sessionId, api, toast, router]);

  useEffect(() => {
    if (step === 3 && sessionId && !sessionDetail) {
      api.getSession(sessionId).then((d) =>
        setSessionDetail({
          sessionName: d.sessionName,
          practiceName: d.practiceName,
          uploadedBy: d.uploadedBy ?? undefined,
          uploadedAt: d.uploadedAt,
          sourceType: d.sourceType,
          intakeTemplateFile: d.intakeTemplateFile ?? undefined,
          pmSourceReportFiles: d.pmSourceReportFiles ?? [],
          totalRows: d.totalRows ?? undefined,
        })
      );
    }
  }, [step, sessionId, sessionDetail, api]);

  const formatDate = (s: string) => {
    try {
      const d = new Date(s);
      const date = d.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
      const time = d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
      return `${date}. ${time}`;
    } catch {
      return s;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          <Link href="/rcm/insurance-ar-analysis" className="hover:text-neutral-700">
            INSURANCE AR ANALYSIS
          </Link>
          {" / UPLOAD AR INTAKE"}
        </p>
        <h1 className="mt-2 text-xl font-semibold text-neutral-900">
          Data Upload and AR Analysis Session Creation
        </h1>
      </div>

      <Stepper steps={steps} />

      {step === 1 && (
        <Card className="animate-fade-in-up">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Practice Name</label>
              <input
                type="text"
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                placeholder="e.g., Medical Billing"
                className="mt-1 w-full max-w-md rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Upload AR Intake File
              </label>
              {!intakeFile ? (
                <div className="mt-2">
                  <FileUploadZone
                    label="Drag and Drop AR Intake File"
                    hint="Accepted formats: XLSX, XLS"
                    onFiles={(f) => setIntakeFile(f[0] ?? null)}
                  />
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{intakeFile.name}</p>
                    <p className="text-xs text-neutral-500">
                      File size: {(intakeFile.size / 1024).toFixed(1)}KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIntakeFile(null)}
                    className="ml-auto text-sm text-primary-600 hover:text-primary-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {validationResult && (
              <ValidationStatus
                result={validationResult}
                loading={validationLoading}
                intakeFileName={intakeFile?.name}
                sessionId={sessionId}
                onReupload={() => {
                  setIntakeFile(null);
                  setValidationResult(null);
                }}
                onDownloadDataValidationErrors={sessionId ? async () => {
                  try {
                    const blob = await api.downloadDataValidationErrors(sessionId);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "DataValidationErrors.xlsx";
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Downloaded.");
                  } catch {
                    toast.error("File not available.");
                  }
                } : undefined}
              />
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={validationResult?.success ? handleNextFromStep1 : handleCreateSession}
                disabled={!practiceName.trim() || !intakeFile || submitLoading}
              >
                {submitLoading ? "Validating…" : validationResult?.success ? "Next →" : "Next →"}
              </Button>
              <Link href="/rcm/insurance-ar-analysis">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="animate-fade-in-up">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-neutral-900">
                Upload PM Source Reports (Required for Audit)
              </h3>
              <FileUploadZone
                label="Drag and Drop PM Source Reports"
                hint="Accepted formats: XLSX, XLS"
                multiple
                onFiles={setPmFiles}
              />
            </div>
            {pmFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-neutral-700">Uploaded File(s)</h4>
                <ul className="space-y-2">
                  {pmFiles.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-neutral-900">{f.name}</p>
                        <p className="text-xs text-neutral-500">
                          File size: {(f.size / 1024).toFixed(2)}KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPmFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
                        aria-label="Remove file"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleUploadPmReports}
                disabled={pmFiles.length === 0 || submitLoading}
              >
                {submitLoading ? "Uploading…" : "Next →"}
              </Button>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Link href="/rcm/insurance-ar-analysis">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {step === 3 && sessionDetail && (
        <Card className="animate-fade-in-up">
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-neutral-900">Review & Create Session</h3>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-neutral-500">Session Name</dt>
                <dd className="font-medium text-neutral-900">{sessionDetail.sessionName}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Practice Name</dt>
                <dd className="font-medium text-neutral-900">{sessionDetail.practiceName}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Uploaded by</dt>
                <dd className="font-medium text-neutral-900">{sessionDetail.uploadedBy ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Uploaded at</dt>
                <dd className="font-medium text-neutral-900">{formatDate(sessionDetail.uploadedAt)}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Source Type</dt>
                <dd className="font-medium text-neutral-900">{sessionDetail.sourceType}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Intake Template File</dt>
                <dd className="font-medium text-neutral-900">{sessionDetail.intakeTemplateFile ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">PM Source Report File</dt>
                <dd className="font-medium text-neutral-900">
                  {sessionDetail.pmSourceReportFiles.length > 0
                    ? sessionDetail.pmSourceReportFiles.join(", ")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Total Rows</dt>
                <dd className="font-medium text-neutral-900">
                  {sessionDetail.totalRows != null ? `${sessionDetail.totalRows} Rows` : "—"}
                </dd>
              </div>
            </dl>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleStartAnalysis} disabled={submitLoading}>
                {submitLoading ? "Starting…" : "Start AR Analysis →"}
              </Button>
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Link href="/rcm/insurance-ar-analysis">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function ValidationStatus({
  result,
  loading,
  intakeFileName,
  sessionId,
  onReupload,
  onDownloadDataValidationErrors,
}: {
  result: ArIntakeValidationResult;
  loading: boolean;
  intakeFileName?: string;
  sessionId: string | null;
  onReupload: () => void;
  onDownloadDataValidationErrors?: () => Promise<void>;
}) {
  const colOk = result.columnValidatedCount > 0 && result.columnErrors.length === 0;
  const rowOk = result.rowValidatedCount > 0 && result.rowErrors.length === 0;
  const allErrors = [...result.columnErrors, ...result.rowErrors];

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <h4 className="font-semibold text-neutral-900">
        {loading ? "Validation In Progress" : result.success ? "Validation Completed" : "Validation In Progress"}
      </h4>
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <ValidationAnalysisIcon className="h-20 w-20" />
          <p className="text-sm font-medium text-neutral-700">
            No errors detected so far.
          </p>
          <p className="text-xs text-neutral-500">
            Analyzing your intake file. This may take a moment.
          </p>
        </div>
      )}
      {!loading && result.success && (
        <p className="text-sm text-neutral-600">
          Validation Completed. You can now move to the next step.
        </p>
      )}

      {intakeFileName && (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-neutral-900">{intakeFileName}</p>
            <p className="text-xs text-neutral-500">Uploaded AR Intake File</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <div>
            <p className="text-sm font-medium text-neutral-700">
              {loading ? "Validating Column(s)" : "Column(s) Validation"}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-primary-600"
                  style={{ width: colOk ? "100%" : "10%" }}
                />
              </div>
              <span className="text-xs text-neutral-600">{colOk ? "Completed" : "10%"}</span>
            </div>
            {colOk ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Validation Successful! {result.columnValidatedCount} column(s) validated; no errors found
              </div>
            ) : result.columnErrors.length > 0 ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Validation Failed! {result.columnValidatedCount} columns validated; {result.columnErrors.length} columns have errors. Please fix them and re-upload the file to continue validation.
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700">
              {loading ? "Validating Row(s)" : "Row(s) Validation"}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-primary-600"
                  style={{ width: rowOk ? "100%" : result.rowValidatedCount > 0 ? "100%" : "10%" }}
                />
              </div>
              <span className="text-xs text-neutral-600">
                {rowOk || (result.rowValidatedCount > 0 && result.rowErrors.length > 0)
                  ? "Completed"
                  : "10%"}
              </span>
            </div>
            {rowOk ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Validation Successful! {result.rowValidatedCount} row(s) validated; no errors found
              </div>
            ) : result.rowErrors.length > 0 ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Validation Failed! {result.rowValidatedCount} rows validated; {result.rowErrors.length} rows have errors. Please fix them and re-upload the file to continue validation.
              </div>
            ) : null}
          </div>

          {allErrors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                {String(allErrors.length).padStart(2, "0")} Error(s) Found
              </p>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Row No.</TableHeaderCell>
                    <TableHeaderCell>Column Name</TableHeaderCell>
                    <TableHeaderCell>Error Found</TableHeaderCell>
                    <TableHeaderCell>Correction</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allErrors.map((e: ArValidationError, i) => (
                    <TableRow key={i}>
                      <TableCell>{e.rowIndex ?? "—"}</TableCell>
                      <TableCell>{e.columnName}</TableCell>
                      <TableCell>{e.message}</TableCell>
                      <TableCell>{e.invalidValue ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-3 flex items-center gap-4">
                {onDownloadDataValidationErrors && (
                  <button
                    type="button"
                    onClick={onDownloadDataValidationErrors}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Download DataValidationErrors.xlsx
                  </button>
                )}
                <button
                  type="button"
                  onClick={onReupload}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Re-upload AR Intake Template
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
