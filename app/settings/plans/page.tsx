"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { PageHeader } from "@/components/settings/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { TableActionsCell } from "@/components/ui/TableActionsCell";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { plansApi } from "@/lib/services/plans";
import { lookupsApi } from "@/lib/services/lookups";
import { BulkImportActions } from "@/components/settings/BulkImportActions";
import { OverlayLoader } from "@/components/ui/OverlayLoader";
import { usePaginatedList, useDebounce } from "@/lib/hooks";
import { useToast } from "@/lib/contexts/ToastContext";
import { useModulePermission } from "@/lib/contexts/PermissionsContext";
import { AccessRestrictedContent } from "@/components/auth/AccessRestrictedContent";
import { resolveEnum, resolveEnumNullable, ENUMS } from "@/lib/utils";
import type { PlanListItemDto, CreatePlanRequest, UpdatePlanRequest } from "@/lib/services/plans";
import type { PayerLookupDto } from "@/lib/services/lookups";

const MODULE_NAME = "Plans";
const STATUS_OPTIONS = [
  { value: 0, name: "Inactive" },
  { value: 1, name: "Active" },
];

// Plan Category / Type enum values for parent-child dropdown filtering
const CATEGORY = ENUMS.PlanCategory;
const TYPE = ENUMS.PlanType;

// Parent-child: which plan types are valid for each plan category
const CATEGORY_TO_TYPES: Record<number, number[]> = {
  [CATEGORY.Commercial]: [TYPE.Hmo, TYPE.Ppo, TYPE.Epo, TYPE.Pos, TYPE.Na],
  [CATEGORY.Medicare]: [TYPE.PartA, TYPE.PartB, TYPE.PartC, TYPE.PartD],
  [CATEGORY.RailroadMedicare]: [TYPE.PartA, TYPE.PartB, TYPE.PartC, TYPE.PartD],
  [CATEGORY.Tricare]: [TYPE.CHAMPUS, TYPE.CHAMPVA],
  [CATEGORY.Medicaid]: [TYPE.Na],
  [CATEGORY.MVA]: [TYPE.Na],
  [CATEGORY.WC]: [TYPE.Na],
  [CATEGORY.HmoManaged]: [TYPE.Hmo, TYPE.Na],
};

export default function PlansPage() {
  const [payers, setPayers] = useState<PayerLookupDto[]>([]);
  const [planCategories, setPlanCategories] = useState<{ value: string; label: string }[]>([]);
  const [planTypes, setPlanTypes] = useState<{ value: string; label: string }[]>([]);
  const [marketTypes, setMarketTypes] = useState<{ value: string; label: string }[]>([]);
  const [nsaCategories, setNsaCategories] = useState<{ value: string; label: string }[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CreatePlanRequest>({
    payerId: "",
    planName: "",
    aliases: "",
    planIdPrefix: "",
    planCategory: 0,
    planType: 0,
    marketType: null,
    oonBenefits: false,
    planResponsibilityPct: null,
    patientResponsibilityPct: null,
    typicalDeductible: null,
    oopMax: null,
    nsaEligible: false,
    nsaCategory: null,
    providerParticipationApplicable: false,
    timelyFilingInitialDays: 0,
    timelyFilingResubmissionDays: null,
    timelyFilingAppealDays: 0,
    status: 1,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const api = plansApi();
  const toast = useToast();
  const { canView, canCreate, canUpdate, canDelete } = useModulePermission(MODULE_NAME);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const { data, error, loading, reload } = usePaginatedList({
    pageNumber: page,
    pageSize,
    extraParams: { search: debouncedSearch || undefined },
    fetch: api.getList,
  });

  useEffect(() => {
    lookupsApi().getPayers().then(setPayers).catch(() => setPayers([]));
    lookupsApi().getPlanCategories().then(setPlanCategories).catch(() => setPlanCategories([]));
    lookupsApi().getPlanTypes().then(setPlanTypes).catch(() => setPlanTypes([]));
    lookupsApi().getMarketTypes().then(setMarketTypes).catch(() => setMarketTypes([]));
    lookupsApi().getNsaCategories().then(setNsaCategories).catch(() => setNsaCategories([]));
  }, []);

  // Filter plan types based on selected plan category
  const filteredPlanTypes = useMemo(() => {
    const allowedTypes = CATEGORY_TO_TYPES[form.planCategory];
    if (!allowedTypes) return planTypes;
    return planTypes.filter((t) => allowedTypes.includes(Number(t.value)));
  }, [form.planCategory, planTypes]);

  const openCreate = () => {
    setEditId(null);
    setForm({
      payerId: payers[0]?.id ?? "",
      planName: "",
      aliases: "",
      planIdPrefix: "",
      planCategory: 0,
      planType: 0,
      marketType: null,
      oonBenefits: false,
      planResponsibilityPct: null,
      patientResponsibilityPct: null,
      typicalDeductible: null,
      oopMax: null,
      nsaEligible: false,
      nsaCategory: null,
      providerParticipationApplicable: false,
      timelyFilingInitialDays: 0,
      timelyFilingResubmissionDays: null,
      timelyFilingAppealDays: 0,
      status: 1,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = async (row: PlanListItemDto) => {
    setEditId(row.id);
    setFormError(null);
    try {
      const detail = await api.getById(row.id);
      setForm({
        payerId: detail.payerId,
        planName: detail.planName,
        aliases: detail.aliases ?? "",
        planIdPrefix: detail.planIdPrefix ?? "",
        planCategory: resolveEnum(detail.planCategory, ENUMS.PlanCategory),
        planType: resolveEnum(detail.planType, ENUMS.PlanType),
        marketType: resolveEnumNullable(detail.marketType, ENUMS.MarketType),
        oonBenefits: detail.oonBenefits,
        planResponsibilityPct: detail.planResponsibilityPct ?? null,
        patientResponsibilityPct: detail.patientResponsibilityPct ?? null,
        typicalDeductible: detail.typicalDeductible ?? null,
        oopMax: detail.oopMax ?? null,
        nsaEligible: detail.nsaEligible,
        nsaCategory: resolveEnumNullable(detail.nsaCategory, ENUMS.NsaCategory),
        providerParticipationApplicable: detail.providerParticipationApplicable,
        timelyFilingInitialDays: detail.timelyFilingInitialDays,
        timelyFilingResubmissionDays: detail.timelyFilingResubmissionDays ?? null,
        timelyFilingAppealDays: detail.timelyFilingAppealDays,
        status: resolveEnum(detail.status, ENUMS.PayerStatus),
      });
      setModalOpen(true);
    } catch {
      setFormError("Failed to load plan.");
    }
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!form.planName.trim() || !form.payerId) {
      setFormError("Payer and plan name are required.");
      return;
    }
    setSubmitLoading(true);
    setOverlayLoading(true);
    try {
      if (editId) {
        await api.update(editId, form as UpdatePlanRequest);
      } else {
        await api.create(form);
      }
      setModalOpen(false);
      await reload();
      toast.success("Saved successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
      setOverlayLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    setOverlayLoading(true);
    try {
      await api.delete(deleteId);
      setDeleteId(null);
      await reload();
      toast.success("Deleted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleteLoading(false);
      setOverlayLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!data) return;
    const allOnPage = data.items.map((r) => r.id);
    const allSelected = allOnPage.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        allOnPage.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        allOnPage.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setDeleteLoading(true);
    setOverlayLoading(true);
    try {
      await api.bulkDelete(Array.from(selectedIds));
      setBulkDeleteConfirm(false);
      setSelectedIds(new Set());
      await reload();
      toast.success(`${selectedIds.size} record(s) deleted successfully.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk delete failed.");
    } finally {
      setDeleteLoading(false);
      setOverlayLoading(false);
    }
  };

  const handleStatusChange = async (row: PlanListItemDto, statusValue: number) => {
    if (!canUpdate) return;
    setStatusUpdatingId(row.id);
    try {
      const detail = await api.getById(row.id);
      await api.update(row.id, {
        payerId: detail.payerId,
        planName: detail.planName,
        aliases: detail.aliases ?? "",
        planIdPrefix: detail.planIdPrefix ?? "",
        planCategory: resolveEnum(detail.planCategory, ENUMS.PlanCategory),
        planType: resolveEnum(detail.planType, ENUMS.PlanType),
        marketType: resolveEnumNullable(detail.marketType, ENUMS.MarketType),
        oonBenefits: detail.oonBenefits,
        planResponsibilityPct: detail.planResponsibilityPct ?? null,
        patientResponsibilityPct: detail.patientResponsibilityPct ?? null,
        typicalDeductible: detail.typicalDeductible ?? null,
        oopMax: detail.oopMax ?? null,
        nsaEligible: detail.nsaEligible,
        nsaCategory: resolveEnumNullable(detail.nsaCategory, ENUMS.NsaCategory),
        providerParticipationApplicable: detail.providerParticipationApplicable,
        timelyFilingInitialDays: detail.timelyFilingInitialDays,
        timelyFilingResubmissionDays: detail.timelyFilingResubmissionDays ?? null,
        timelyFilingAppealDays: detail.timelyFilingAppealDays,
        status: statusValue,
      } as UpdatePlanRequest);
      await reload();
      toast.success("Status updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const planCategoryLabel = (n: number) => planCategories.find((c) => Number(c.value) === n)?.label ?? String(n);
  const planTypeLabel = (n: number) => planTypes.find((t) => Number(t.value) === n)?.label ?? String(n);
  const statusLabel = (n: number) => STATUS_OPTIONS.find((o) => o.value === n)?.name ?? String(n);

  if (!canView) {
    return (
      <div>
        <PageHeader title="Plan Configuration" description="Centralized plan registry." />
        <Card>
          <AccessRestrictedContent sectionName="Plan Configuration" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6">
      <PageHeader title="Plan Configuration" description="Centralized plan registry." />

      {/* Toolbar: search + add button */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center">
          <Select value="" onValueChange={() => {}}>
            <SelectTrigger className="w-[130px] h-10 border-[#E2E8F0] rounded-l-[5px] font-aileron text-[14px] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-r-[5px] border border-[#E2E8F0] bg-background pl-9 pr-4 font-aileron text-[14px] placeholder:text-[#94A3B8] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canDelete && selectedIds.size > 0 && (
            <Button
              onClick={() => setBulkDeleteConfirm(true)}
              className="h-10 rounded-[5px] px-[18px] bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-aileron text-[14px]"
            >
              <><Trash2 className="mr-1 h-4 w-4" /> Delete ({selectedIds.size})</>
            </Button>
          )}
          {canCreate && (
            <>
              <BulkImportActions
                apiBase="/api/Plans"
                templateFileName="Plans_Import_Template.xlsx"
                onImportSuccess={reload}
                onLoadingChange={setOverlayLoading}
              />
              <Button
                onClick={openCreate}
                className="h-10 rounded-[5px] px-[18px] bg-[#0066CC] hover:bg-[#0066CC]/90 text-white font-aileron text-[14px]"
              >
                <>Add Plan <ArrowRight className="ml-1 h-4 w-4" /></>
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}
      {data && (
           <div className="flex min-h-0 flex-1 flex-col">
           <div className="max-h-[calc(100vh-316px)] min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-[5px]">
             <Table className="min-w-[1800px] table-fixed">
              <TableHead className="sticky top-0 z-20">
                <TableRow>
                  {canDelete && (
                    <TableHeaderCell className="!min-w-[50px] w-[50px]">
                      <Checkbox
                        checked={!!data?.items.length && data.items.every((r) => selectedIds.has(r.id))}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHeaderCell>
                  )}
                  <TableHeaderCell className="w-[220px] min-w-[220px]">Plan Name</TableHeaderCell>
                  <TableHeaderCell className="w-[160px] min-w-[160px]">Plan ID</TableHeaderCell>
                  <TableHeaderCell className="w-[220px] min-w-[220px]">Linked Payer</TableHeaderCell>
                  <TableHeaderCell className="w-[160px] min-w-[160px]">Plan Category</TableHeaderCell>
                  <TableHeaderCell className="w-[200px] min-w-[200px]">Plan Type</TableHeaderCell>
                  <TableHeaderCell className="w-[190px] min-w-[190px]">Out-of-Network Benefits</TableHeaderCell>
                  <TableHeaderCell className="w-[130px] min-w-[130px]">NSA Eligible</TableHeaderCell>
                  <TableHeaderCell className="w-[160px] min-w-[160px]">NSA Category</TableHeaderCell>
                  <TableHeaderCell className="w-[180px] min-w-[180px]">Status</TableHeaderCell>
                  {(canUpdate || canDelete) && (
                    <TableHeaderCell className="!w-[120px] min-w-[120px]">Actions</TableHeaderCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((row) => (
                  <TableRow key={row.id}>
                    {canDelete && (
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={() => toggleSelect(row.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="w-[220px] min-w-[220px]">
                      <div className="max-w-xs truncate">{row.planName}</div>
                    </TableCell>
                    <TableCell className="w-[160px] min-w-[160px]">
                      <div className="max-w-[140px] truncate">{row.planIdPrefix ?? "—"}</div>
                    </TableCell>
                    <TableCell className="w-[220px] min-w-[220px]">
                      <div className="max-w-xs truncate">{row.linkedPayerName}</div>
                    </TableCell>
                    <TableCell className="w-[200px] min-w-[200px]">
                      <div className="max-w-[140px] truncate">
                        {planCategoryLabel(row.planCategory)}
                      </div>
                    </TableCell>
                    <TableCell className="w-[200px] min-w-[200px]">
                      <div className="max-w-[140px] truncate">
                        {planTypeLabel(row.planType)}
                      </div>
                    </TableCell>
                    <TableCell className="w-[220px] min-w-[220px]">
                      <div className="max-w-[180px] truncate">
                        {row.oonBenefits ? "Yes" : "No"}
                      </div>
                    </TableCell>
                    <TableCell className="w-[180px] min-w-[180px]">
                      <div className="max-w-[140px] truncate">
                        {row.nsaEligible ? "Yes" : "No"}
                      </div>
                    </TableCell>
                    <TableCell className="w-[200px] min-w-[200px]">
                      <div className="max-w-[180px] truncate">
                        {(row as any).nsaCategory ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="w-[180px] min-w-[180px]">
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row, Number(e.target.value))}
                        disabled={!canUpdate || statusUpdatingId === row.id}
                        className="input-enterprise w-[140px] rounded-l-[5px] rounded-r-0 px-2 py-1.5 text-sm disabled:opacity-50 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    {(canUpdate || canDelete) && (
                      <TableCell className="!w-[120px] min-w-[120px]">
                        <TableActionsCell
                          canEdit={canUpdate}
                          canDelete={canDelete}
                          onEdit={() => openEdit(row)}
                          onDelete={() => setDeleteId(row.id)}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="shrink-0 pt-4">
            <Pagination
              pageNumber={data.pageNumber}
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
          </div>
        </div>
      )}
      {loading && !data && !error && (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit plan" : "Add plan"}
        size="lg"
        position="right"
        footer={
          <ModalFooter
            onCancel={() => setModalOpen(false)}
            submitLabel={
              <>
                {editId ? "Update" : "Add Plan"}
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </>
            }
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {formError && (
            <div className="mb-4 rounded-[5px]">
              <Alert variant="error">{formError}</Alert>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Payer *</label>
              <select
                value={form.payerId}
                onChange={(e) => setForm((f) => ({ ...f, payerId: e.target.value }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                required
              >
                <option value="">Select payer</option>
                {payers.map((p) => (
                  <option key={p.id} value={p.id}>{p.payerName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Plan name *</label>
              <input
                type="text"
                value={form.planName}
                onChange={(e) => setForm((f) => ({ ...f, planName: e.target.value }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Aliases</label>
              <input
                type="text"
                value={form.aliases ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, aliases: e.target.value }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Plan ID prefix</label>
              <input
                type="text"
                value={form.planIdPrefix ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, planIdPrefix: e.target.value }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Plan category</label>
              <select
                value={form.planCategory}
                onChange={(e) => {
                const newCategory = Number(e.target.value);
                const allowedTypes = CATEGORY_TO_TYPES[newCategory];
                const defaultType = allowedTypes?.[0] ?? 0;
                setForm((f) => ({ ...f, planCategory: newCategory, planType: defaultType }));
              }}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                {planCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Plan type</label>
              <select
                value={form.planType}
                onChange={(e) => setForm((f) => ({ ...f, planType: Number(e.target.value) }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                {filteredPlanTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Market type</label>
              <select
                value={form.marketType ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, marketType: e.target.value ? Number(e.target.value) : null }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <option value="">—</option>
                {marketTypes.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">NSA category</label>
              <select
                value={form.nsaCategory ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, nsaCategory: e.target.value ? Number(e.target.value) : null }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <option value="">—</option>
                {nsaCategories.map((n) => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 sm:col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.oonBenefits} onChange={(e) => setForm((f) => ({ ...f, oonBenefits: e.target.checked }))} className="rounded border-input" />
                <span className="text-sm text-foreground">OON benefits</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.nsaEligible} onChange={(e) => setForm((f) => ({ ...f, nsaEligible: e.target.checked }))} className="rounded border-input" />
                <span className="text-sm text-foreground">NSA eligible</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.providerParticipationApplicable} onChange={(e) => setForm((f) => ({ ...f, providerParticipationApplicable: e.target.checked }))} className="rounded border-input" />
                <span className="text-sm text-foreground">Provider participation applicable</span>
              </label>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Plan responsibility %</label>
              <input
                type="number"
                step="any"
                value={form.planResponsibilityPct ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, planResponsibilityPct: e.target.value === "" ? null : Number(e.target.value) }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                placeholder="—"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Patient responsibility %</label>
              <input
                type="number"
                step="any"
                value={form.patientResponsibilityPct ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, patientResponsibilityPct: e.target.value === "" ? null : Number(e.target.value) }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                placeholder="—"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Typical deductible</label>
              <input
                type="number"
                step="any"
                value={form.typicalDeductible ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, typicalDeductible: e.target.value === "" ? null : Number(e.target.value) }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                placeholder="—"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">OOP max</label>
              <input
                type="number"
                step="any"
                value={form.oopMax ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, oopMax: e.target.value === "" ? null : Number(e.target.value) }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                placeholder="—"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Timely filing initial (days)</label>
              <input
                type="number"
                value={form.timelyFilingInitialDays}
                onChange={(e) => setForm((f) => ({ ...f, timelyFilingInitialDays: Number(e.target.value) || 0 }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Timely filing resubmission (days)</label>
              <input
                type="number"
                value={form.timelyFilingResubmissionDays ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, timelyFilingResubmissionDays: e.target.value === "" ? null : Number(e.target.value) }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                placeholder="—"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Timely filing appeal (days)</label>
              <input
                type="number"
                value={form.timelyFilingAppealDays}
                onChange={(e) => setForm((f) => ({ ...f, timelyFilingAppealDays: Number(e.target.value) || 0 }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: Number(e.target.value) }))}
                className="w-full rounded-[5px] border border-input px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete plan" message="Are you sure you want to delete this plan?" confirmLabel="Delete" variant="danger" loading={deleteLoading} />
      <ConfirmDialog
        open={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete selected plans"
        message={`Are you sure you want to delete ${selectedIds.size} plan(s)? This action cannot be undone.`}
        confirmLabel="Delete All"
        variant="danger"
        loading={deleteLoading}
      />
      <OverlayLoader visible={overlayLoading} />
    </div>
  );
}
