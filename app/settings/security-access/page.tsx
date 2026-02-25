"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/settings/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
import { securityAccessApi } from "@/lib/services/securityAccess";
import type {
  SecuritySettingsDto,
  UpdateSecuritySettingsRequest,
  SecurityUserDto,
} from "@/lib/services/securityAccess";
import { useToast } from "@/lib/contexts/ToastContext";
import { useModulePermission } from "@/lib/contexts/PermissionsContext";

const MODULE_NAME = "Security Access";

const MFA_FREQUENCY_OPTIONS = [
  { value: "EveryLogin", label: "Require MFA at every login" },
  { value: "OnceEvery24Hours", label: "Require MFA once every 24 hours (default)" },
] as const;

const INACTIVITY_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes (default)" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
] as const;

/** Toggle switch styled as a switch control */
function Toggle({
  checked,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
        ${checked ? "bg-primary-600" : "bg-slate-200"}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
          transition-transform
          ${checked ? "translate-x-5" : "translate-x-0.5"}
        `}
      />
    </button>
  );
}

export default function SecurityAccessPage() {
  const [settings, setSettings] = useState<SecuritySettingsDto | null>(null);
  const [users, setUsers] = useState<SecurityUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [form, setForm] = useState<UpdateSecuritySettingsRequest | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [mfaDisablingId, setMfaDisablingId] = useState<string | null>(null);

  const api = securityAccessApi();
  const toast = useToast();
  const { canView, canUpdate } = useModulePermission(MODULE_NAME);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadSettings = useCallback(() => {
    api
      .getSettings()
      .then((data) => {
        setSettings(data);
        setForm({
          mfaRequiredForAllUsers: data.mfaRequiredForAllUsers,
          mfaFrequency: data.mfaFrequency,
          inactivityTimeoutMinutes: data.inactivityTimeoutMinutes,
          dailySessionResetEnabled: data.dailySessionResetEnabled,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load settings"));
  }, []);

  const loadUsers = useCallback(() => {
    api
      .getUsers(searchDebounced || undefined)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [searchDebounced]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([api.getSettings(), api.getUsers()])
      .then(([settingsData, usersData]) => {
        setSettings(settingsData);
        setForm({
          mfaRequiredForAllUsers: settingsData.mfaRequiredForAllUsers,
          mfaFrequency: settingsData.mfaFrequency,
          inactivityTimeoutMinutes: settingsData.inactivityTimeoutMinutes,
          dailySessionResetEnabled: settingsData.dailySessionResetEnabled,
        });
        setUsers(usersData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) loadUsers();
  }, [loading, searchDebounced]);

  const handleSaveSettings = async () => {
    if (!form) return;
    setFormError(null);
    setSaving(true);
    try {
      await api.updateSettings({
        mfaRequiredForAllUsers: form.mfaRequiredForAllUsers,
        mfaFrequency: form.mfaFrequency ?? "OnceEvery24Hours",
        inactivityTimeoutMinutes: form.inactivityTimeoutMinutes ?? 30,
        dailySessionResetEnabled: form.dailySessionResetEnabled ?? false,
      });
      loadSettings();
      toast.success("Security settings saved.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDisableMfa = async (userId: string) => {
    setMfaDisablingId(userId);
    try {
      await api.disableUserMfa(userId);
      loadUsers();
      toast.success("MFA disabled for user.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to disable MFA.");
    } finally {
      setMfaDisablingId(null);
    }
  };

  if (!canView) {
    return (
      <div>
        <PageHeader title="Security Access" description="Manage security and MFA settings." />
        <Card>
          <p className="text-sm text-slate-600">You do not have permission to view this page.</p>
        </Card>
      </div>
    );
  }

  if (loading && !settings) {
    return (
      <div>
        <PageHeader title="Security Access" description="Manage security and MFA settings." />
        <div className="py-12 text-center">
          <Loader variant="inline" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Security Access"
        description="Security settings control how users authenticate and how long sessions remain active. These controls help protect your organization from unauthorized access while maintaining usability for daily operations."
      />

      {error && (
        <div className="mb-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {form && (
        <div className="space-y-8">
          {/* MFA for Account Administrator - info only */}
          <Card>
            <h3 className="text-base font-semibold text-slate-900">MFA for Account Administrator</h3>
            <p className="mt-2 text-sm text-slate-600">
              Multi-Factor Authentication is mandatory for all Account Administrators and cannot be
              disabled. Account Administrators have elevated permissions that affect system security,
              user access, and configuration. MFA is always required for these roles to reduce the
              risk of unauthorized access.
            </p>
          </Card>

          {/* MFA Frequency */}
          <Card>
            <h3 className="text-base font-semibold text-slate-900">MFA Frequency</h3>
            <p className="mt-1 text-sm text-slate-600">
              Define how often users must re-confirm their identity using MFA.
            </p>
            <div className="mt-4 space-y-2">
              {MFA_FREQUENCY_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="mfaFrequency"
                    checked={(form.mfaFrequency ?? "OnceEvery24Hours") === opt.value}
                    onChange={() => setForm((f) => (f ? { ...f, mfaFrequency: opt.value } : f))}
                    disabled={!canUpdate}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* MFA for Users */}
          <Card>
            <h3 className="text-base font-semibold text-slate-900">MFA for Users</h3>
            <p className="mt-1 text-sm text-slate-600">
              Control whether Multi-Factor Authentication is required for non-administrator users.
              You may enable MFA for all users or selectively enforce it for specific users based on
              your organization&apos;s security needs. Account Administrators are always protected
              by MFA and are not affected by this setting.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Enable MFA for all users</span>
              <Toggle
                checked={form.mfaRequiredForAllUsers}
                onChange={() =>
                  setForm((f) =>
                    f ? { ...f, mfaRequiredForAllUsers: !f.mfaRequiredForAllUsers } : f
                  )
                }
                disabled={!canUpdate}
                aria-label="Enable MFA for all users"
              />
            </div>
            <div className="mt-4">
              <Input
                label="Search user"
                placeholder="Search user"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                wrapperClassName="max-w-xs"
              />
            </div>
            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>User(s)</TableHeaderCell>
                    <TableHeaderCell>MFA Status</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-sm text-slate-500">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-900">{u.userName}</div>
                            {u.roleName && (
                              <div className="text-xs text-slate-500">{u.roleName}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {u.isTwoFactorEnabled ? (
                            <>
                              <Toggle
                                checked={true}
                                onChange={() => handleDisableMfa(u.id)}
                                disabled={!canUpdate || mfaDisablingId === u.id}
                                aria-label={`Disable MFA for ${u.userName}`}
                              />
                              {mfaDisablingId === u.id && (
                                <span className="ml-2 inline-block align-middle">
                                  <Loader variant="inline" />
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-slate-500" title="User must complete MFA setup at next login when MFA for all users is enabled">
                              Not enrolled
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Session Management */}
          <Card>
            <h3 className="text-base font-semibold text-slate-900">Session Management</h3>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-800">Inactivity Timeout</h4>
              <p className="mt-1 text-sm text-slate-600">
                Automatically log users out after a period of inactivity. If no activity is
                detected for the selected time period, the user will be logged out and required to
                sign in again.
              </p>
              <div className="mt-3 space-y-2">
                {INACTIVITY_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="inactivityTimeout"
                      checked={(form.inactivityTimeoutMinutes ?? 30) === opt.value}
                      onChange={() =>
                        setForm((f) =>
                          f ? { ...f, inactivityTimeoutMinutes: opt.value } : f
                        )
                      }
                      disabled={!canUpdate}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h4 className="text-sm font-semibold text-slate-800">Daily Session Reset</h4>
              <p className="mt-1 text-sm text-slate-600">
                Require all users to log in again once per day. All active sessions are
                automatically ended at midnight based on your organization&apos;s time zone.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Toggle
                  checked={form.dailySessionResetEnabled ?? false}
                  onChange={() =>
                    setForm((f) =>
                      f ? { ...f, dailySessionResetEnabled: !f.dailySessionResetEnabled } : f
                    )
                  }
                  disabled={!canUpdate}
                  aria-label="Daily session reset"
                />
                <span className="text-sm text-slate-600">
                  {form.dailySessionResetEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </Card>

          {canUpdate && (
            <div className="flex items-center gap-4">
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
              {formError && (
                <span className="text-sm text-red-600">{formError}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
