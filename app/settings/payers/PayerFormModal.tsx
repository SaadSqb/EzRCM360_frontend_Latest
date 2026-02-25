"use client";

import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type {
  CreatePayerRequest,
  PayerAddressRequest,
  PayerPhoneRequest,
  PayerEmailRequest,
} from "@/lib/services/payers";
import type { SelectOption } from "@/components/ui/Select";
import type { PlanLookupDto } from "@/lib/services/lookups";

const STATUS_OPTIONS: SelectOption<number>[] = [
  { value: 0, label: "Inactive" },
  { value: 1, label: "Active" },
];

const emptyAddress: PayerAddressRequest = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  label: "",
};

const emptyPhone: PayerPhoneRequest = {
  phoneNumber: "",
  label: "",
};

const emptyEmail: PayerEmailRequest = {
  emailAddress: "",
  label: "",
};

export interface PayerFormModalProps {
  open: boolean;
  onClose: () => void;
  editId: string | null;
  form: CreatePayerRequest;
  onFormChange: (form: CreatePayerRequest) => void;
  entityTypeOptions: { value: string; label: string }[];
  planOptions: PlanLookupDto[];
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function PayerFormModal({
  open,
  onClose,
  editId,
  form,
  onFormChange,
  entityTypeOptions,
  planOptions,
  onSubmit,
  loading,
  error,
}: PayerFormModalProps) {
  const addresses = form.addresses ?? [];
  const phoneNumbers = form.phoneNumbers ?? [];
  const emails = form.emails ?? [];
  const planIds = form.planIds ?? [];

  const setAddresses = (list: PayerAddressRequest[]) =>
    onFormChange({ ...form, addresses: list });
  const setPhoneNumbers = (list: PayerPhoneRequest[]) =>
    onFormChange({ ...form, phoneNumbers: list });
  const setEmails = (list: PayerEmailRequest[]) =>
    onFormChange({ ...form, emails: list });
  const setPlanIds = (ids: string[]) =>
    onFormChange({ ...form, planIds: ids });

  const addAddress = () => setAddresses([...addresses, { ...emptyAddress }]);
  const removeAddress = (index: number) =>
    setAddresses(addresses.filter((_, i) => i !== index));
  const updateAddress = (index: number, field: keyof PayerAddressRequest, value: string | null) => {
    const next = [...addresses];
    next[index] = { ...next[index], [field]: value ?? "" };
    setAddresses(next);
  };

  const addPhone = () => setPhoneNumbers([...phoneNumbers, { ...emptyPhone }]);
  const removePhone = (index: number) =>
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  const updatePhone = (index: number, field: keyof PayerPhoneRequest, value: string | null) => {
    const next = [...phoneNumbers];
    next[index] = { ...next[index], [field]: value ?? "" };
    setPhoneNumbers(next);
  };

  const addEmail = () => setEmails([...emails, { ...emptyEmail }]);
  const removeEmail = (index: number) =>
    setEmails(emails.filter((_, i) => i !== index));
  const updateEmail = (index: number, field: keyof PayerEmailRequest, value: string | null) => {
    const next = [...emails];
    next[index] = { ...next[index], [field]: value ?? "" };
    setEmails(next);
  };

  const togglePlan = (planId: string) => {
    if (planIds.includes(planId)) {
      setPlanIds(planIds.filter((id) => id !== planId));
    } else {
      setPlanIds([...planIds, planId]);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editId ? "Edit payer" : "Add payer"}
      size="lg"
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Basic information</h3>
            <Input
              label="Payer name"
              required
              value={form.payerName}
              onChange={(e) => onFormChange({ ...form, payerName: e.target.value })}
            />
            <Input
              label="Aliases"
              value={form.aliases ?? ""}
              onChange={(e) => onFormChange({ ...form, aliases: e.target.value })}
            />
            <Select
              label="Entity type"
              options={entityTypeOptions}
              value={form.entityType}
              onChange={(e) => onFormChange({ ...form, entityType: Number(e.target.value) })}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(e) => onFormChange({ ...form, status: Number(e.target.value) })}
            />
          </div>

          {/* Addresses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Addresses</h3>
              <Button type="button" variant="secondary" onClick={addAddress}>
                Add address
              </Button>
            </div>
            {addresses.length === 0 && (
              <p className="text-sm text-slate-500">No addresses. Click &quot;Add address&quot; to add one.</p>
            )}
            {addresses.map((addr, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3"
              >
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeAddress(index)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Address line 1"
                    value={addr.addressLine1}
                    onChange={(e) => updateAddress(index, "addressLine1", e.target.value)}
                  />
                  <Input
                    label="Address line 2"
                    value={addr.addressLine2 ?? ""}
                    onChange={(e) => updateAddress(index, "addressLine2", e.target.value)}
                  />
                  <Input
                    label="City"
                    value={addr.city}
                    onChange={(e) => updateAddress(index, "city", e.target.value)}
                  />
                  <Input
                    label="State"
                    value={addr.state}
                    onChange={(e) => updateAddress(index, "state", e.target.value)}
                  />
                  <Input
                    label="ZIP"
                    value={addr.zip}
                    onChange={(e) => updateAddress(index, "zip", e.target.value)}
                  />
                  <Input
                    label="Label (e.g. Billing)"
                    value={addr.label ?? ""}
                    onChange={(e) => updateAddress(index, "label", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Phone numbers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Phone numbers</h3>
              <Button type="button" variant="secondary" onClick={addPhone}>
                Add phone
              </Button>
            </div>
            {phoneNumbers.length === 0 && (
              <p className="text-sm text-slate-500">No phone numbers.</p>
            )}
            {phoneNumbers.map((ph, index) => (
              <div
                key={index}
                className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="min-w-[200px] flex-1">
                  <Input
                    label="Phone number"
                    value={ph.phoneNumber}
                    onChange={(e) => updatePhone(index, "phoneNumber", e.target.value)}
                  />
                </div>
                <div className="min-w-[120px] flex-1">
                  <Input
                    label="Label"
                    value={ph.label ?? ""}
                    onChange={(e) => updatePhone(index, "label", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => removePhone(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Emails */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Emails</h3>
              <Button type="button" variant="secondary" onClick={addEmail}>
                Add email
              </Button>
            </div>
            {emails.length === 0 && (
              <p className="text-sm text-slate-500">No emails.</p>
            )}
            {emails.map((em, index) => (
              <div
                key={index}
                className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="min-w-[200px] flex-1">
                  <Input
                    label="Email address"
                    type="email"
                    value={em.emailAddress}
                    onChange={(e) => updateEmail(index, "emailAddress", e.target.value)}
                  />
                </div>
                <div className="min-w-[120px] flex-1">
                  <Input
                    label="Label"
                    value={em.label ?? ""}
                    onChange={(e) => updateEmail(index, "label", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => removeEmail(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Plans */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Linked plans</h3>
            <p className="text-sm text-slate-500">
              Select plans that belong to this payer. Plans are scoped to your organization.
            </p>
            {planOptions.length === 0 && (
              <p className="text-sm text-slate-500">No plans available. Create plans first under Plan Configuration.</p>
            )}
            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 p-3">
              <div className="space-y-2">
                {planOptions.map((plan) => (
                  <label
                    key={plan.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={planIds.includes(plan.id)}
                      onChange={() => togglePlan(plan.id)}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-800">{plan.displayName}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ModalFooter
          onCancel={onClose}
          submitLabel={editId ? "Update" : "Create"}
          onSubmit={onSubmit}
          loading={loading}
        />
      </form>
    </Modal>
  );
}
