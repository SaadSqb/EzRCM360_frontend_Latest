"use client";

import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { CreatePayerRequest } from "@/lib/services/payers";
import type { SelectOption } from "@/components/ui/Select";

const STATUS_OPTIONS: SelectOption<number>[] = [
  { value: 0, label: "Inactive" },
  { value: 1, label: "Active" },
];

export interface PayerFormModalProps {
  open: boolean;
  onClose: () => void;
  editId: string | null;
  form: CreatePayerRequest;
  onFormChange: (form: CreatePayerRequest) => void;
  entityTypeOptions: { value: string; label: string }[];
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
  onSubmit,
  loading,
  error,
}: PayerFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={editId ? "Edit payer" : "Add payer"}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
        <div className="space-y-4">
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
