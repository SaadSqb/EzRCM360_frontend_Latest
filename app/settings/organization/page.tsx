"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { getApiUrl } from "@/lib/api";
import { useToast } from "@/lib/contexts/ToastContext";
import { useModulePermission } from "@/lib/contexts/PermissionsContext";
import { organizationsApi } from "@/lib/services/organizations";
import type {
  OrganizationProfileDto,
  UpdateCurrentOrganizationRequest,
} from "@/lib/services/organizations";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "—";
}

const DATE_FORMAT_OPTIONS: { value: string; label: string }[] = [
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
  { value: "MM-DD-YYYY", label: "MM-DD-YYYY" },
];

const TIME_FORMAT_OPTIONS: { value: string; label: string }[] = [
  { value: "HH:MM", label: "HH:MM (24h)" },
  { value: "HH:MM:SS", label: "HH:MM:SS (24h)" },
  { value: "hh:mm A", label: "hh:mm A (12h)" },
  { value: "hh:mm:ss A", label: "hh:mm:ss A (12h)" },
];

const TIME_ZONE_OPTIONS: { value: string; label: string }[] = [
  { value: "Eastern Time (ET) – UTC −5 / UTC −4 (DST)", label: "Eastern Time (ET) – UTC −5 / UTC −4 (DST)" },
  { value: "Central Time (CT) – UTC −6 / UTC −5 (DST)", label: "Central Time (CT) – UTC −6 / UTC −5 (DST)" },
  { value: "Mountain Time (MT) – UTC −7 / UTC −6 (DST)", label: "Mountain Time (MT) – UTC −7 / UTC −6 (DST)" },
  { value: "Pacific Time (PT) – UTC −8 / UTC −7 (DST)", label: "Pacific Time (PT) – UTC −8 / UTC −7 (DST)" },
  { value: "UTC", label: "UTC" },
  { value: "", label: "—" },
];

function formatDateExample(format: string | null | undefined): string {
  if (!format) return "—";
  const d = new Date(2026, 0, 29); // 2026-01-29
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const mm = m;
  const dd = day;
  const map: Record<string, string> = {
    "YYYY-MM-DD": `${y}-${m}-${dd}`,
    "MM/DD/YYYY": `${mm}/${dd}/${y}`,
    "DD/MM/YYYY": `${dd}/${mm}/${y}`,
    "DD-MM-YYYY": `${dd}-${mm}-${y}`,
    "MM-DD-YYYY": `${mm}-${dd}-${y}`,
  };
  return map[format] ?? format;
}

function formatTimeExample(format: string | null | undefined): string {
  if (!format) return "—";
  const d = new Date(2026, 0, 29, 14, 45, 0); // 14:45
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  const hh12 = String(h12).padStart(2, "0");
  const map: Record<string, string> = {
    "HH:MM": `${hh}:${mm}`,
    "HH:MM:SS": `${hh}:${mm}:${ss}`,
    "hh:mm A": `${hh12}:${mm} ${ampm}`,
    "hh:mm:ss A": `${hh12}:${mm}:${ss} ${ampm}`,
  };
  return map[format] ?? format;
}

export default function OrganizationPage() {
  const [profile, setProfile] = useState<OrganizationProfileDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<UpdateCurrentOrganizationRequest>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const ALLOWED_LOGO_TYPES = ".png,.jpg,.jpeg,.pdf";
  const MAX_LOGO_MB = 5;
  const MAX_LOGO_BYTES = MAX_LOGO_MB * 1024 * 1024;

  const api = organizationsApi();
  const toast = useToast();
  const { canView, canUpdate } = useModulePermission("Organizations");

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getCurrent()
      .then(setProfile)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load organization")
      )
      .finally(() => setLoading(false));
  }, []);

  const openEdit = () => {
    if (!profile) return;
    setForm({
      name: profile.name,
      primaryAdministratorUserId: profile.primaryAdministratorUserId ?? undefined,
      defaultTimeZone: profile.defaultTimeZone ?? undefined,
      systemDateFormat: profile.systemDateFormat ?? undefined,
      systemTimeFormat: profile.systemTimeFormat ?? undefined,
      logoUrl: profile.logoUrl ?? undefined,
    });
    setLogoFile(null);
    setFormError(null);
    setEditOpen(true);
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (logoFile && logoFile.size > MAX_LOGO_BYTES) {
      setFormError(`Logo must be ${MAX_LOGO_MB} MB or less.`);
      return;
    }
    setSubmitLoading(true);
    try {
      if (logoFile) {
        await api.updateCurrentWithForm(form, logoFile);
      } else {
        await api.updateCurrent(form);
      }
      const updated = await api.getCurrent();
      setProfile(updated);
      setEditOpen(false);
      toast.success("Saved successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/settings" className="text-primary-600 hover:text-primary-700">
            Settings & Configurations
          </Link>
          <span className="mx-1">/</span>
          <span className="text-slate-700">Organization</span>
        </div>
        <div className="py-12 text-center text-sm text-slate-500">Loading…</div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div>
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/settings" className="text-primary-600 hover:text-primary-700">
            Settings & Configurations
          </Link>
          <span className="mx-1">/</span>
          <span className="text-slate-700">Organization</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/settings" className="text-primary-600 hover:text-primary-700">
            Settings & Configurations
          </Link>
          <span className="mx-1">/</span>
          <span className="text-slate-700">Organization</span>
        </div>
        <Card>
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error ?? "Organization not found."}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-slate-500">
        <Link href="/settings" className="text-primary-600 hover:text-primary-700">
          Settings & Configurations
        </Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700">Organization</span>
      </div>

      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Organization</h1>

      {/* Summary card: avatar + name + contact */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-semibold text-white">
            {profile.logoUrl ? (
              <img
                src={
                  profile.logoUrl.startsWith("http")
                    ? profile.logoUrl
                    : getApiUrl(`/api/files/${profile.logoUrl}`)
                }
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              getInitials(profile.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{profile.name}</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-600">
              <svg
                className="h-4 w-4 shrink-0 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>—</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Organization Information */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-base font-semibold text-slate-900">
            Organization Information
          </h3>
        </div>
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Organization Name
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-900">{profile.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Primary Administrator
            </dt>
            <dd className="mt-0.5 text-sm text-slate-900">
              {profile.primaryAdministratorUserId ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Default Time Zone
            </dt>
            <dd className="mt-0.5 text-sm text-slate-900">
              {profile.defaultTimeZone ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              System Date Format
            </dt>
            <dd className="mt-0.5 text-sm text-slate-900">
              {profile.systemDateFormat
                ? `${profile.systemDateFormat} – ${formatDateExample(profile.systemDateFormat)}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              System Time Format
            </dt>
            <dd className="mt-0.5 text-sm text-slate-900">
              {profile.systemTimeFormat
                ? `${profile.systemTimeFormat} – ${formatTimeExample(profile.systemTimeFormat)}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Organization Status
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-900">
              {profile.isActive ? "Active" : "Inactive"}
            </dd>
          </div>
        </div>
        {canUpdate && (
          <div className="mt-6">
            <Button onClick={openEdit} className="inline-flex items-center gap-2">
              Edit Organization
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        )}
      </Card>

      {/* Update Organization modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Update Organization"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {formError && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Organization Name
              </label>
              <input
                type="text"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. PrimeCare Billing Solutions"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Primary Administrator
              </label>
              <input
                type="text"
                value={form.primaryAdministratorUserId ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    primaryAdministratorUserId: e.target.value || undefined,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="User ID (e.g. RCM-12453 or Guid)"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Default Time Zone
              </label>
              <select
                value={form.defaultTimeZone ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    defaultTimeZone: e.target.value || undefined,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {TIME_ZONE_OPTIONS.map((opt) => (
                  <option key={opt.value || "empty"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                {form.defaultTimeZone &&
                  !TIME_ZONE_OPTIONS.some((o) => o.value === form.defaultTimeZone) && (
                    <option value={form.defaultTimeZone}>{form.defaultTimeZone}</option>
                  )}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                System Date Format
              </label>
              <div className="flex flex-wrap items-baseline gap-2">
                <select
                  value={form.systemDateFormat ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      systemDateFormat: e.target.value || undefined,
                    }))
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">—</option>
                  {DATE_FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-500">
                  → {formatDateExample(form.systemDateFormat)}
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                System Time Format
              </label>
              <div className="flex flex-wrap items-baseline gap-2">
                <select
                  value={form.systemTimeFormat ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      systemTimeFormat: e.target.value || undefined,
                    }))
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">—</option>
                  {TIME_FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-500">
                  → {formatTimeExample(form.systemTimeFormat)}
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Upload Logo
              </label>
              <p className="mb-2 text-xs text-slate-500">
                Supported Formats (PNG, JPG, PDF) | Maximum file size: {MAX_LOGO_MB} MB
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File(s)
                <input
                  type="file"
                  accept={ALLOWED_LOGO_TYPES}
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
              {logoFile && (
                <p className="mt-1 text-xs text-slate-600">
                  Selected: {logoFile.name}
                </p>
              )}
            </div>
          </div>
          <ModalFooter
            onCancel={() => setEditOpen(false)}
            submitLabel="Update"
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        </form>
      </Modal>
    </div>
  );
}
