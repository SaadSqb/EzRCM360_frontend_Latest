"use client";

import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { CreateEntityRequest } from "@/lib/services/entities";
import type { SelectOption } from "@/components/ui/Select";

const STATUS_OPTIONS: SelectOption<number>[] = [
  { value: 0, label: "Inactive" },
  { value: 1, label: "Active" },
];

export interface EntityFormModalProps {
  open: boolean;
  onClose: () => void;
  editId: string | null;
  form: CreateEntityRequest;
  onFormChange: (form: CreateEntityRequest) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function EntityFormModal({
  open,
  onClose,
  editId,
  form,
  onFormChange,
  onSubmit,
  loading,
  error,
}: EntityFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editId ? "Edit entity" : "Add entity"}
      size="lg"
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Legal name"
              required
              value={form.legalName}
              onChange={(e) => onFormChange({ ...form, legalName: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Display name"
              required
              value={form.displayName}
              onChange={(e) => onFormChange({ ...form, displayName: e.target.value })}
            />
          </div>
          <Input
            label="Group NPI"
            required
            value={form.groupNpi}
            onChange={(e) => onFormChange({ ...form, groupNpi: e.target.value })}
          />
          <Input
            label="Tax ID"
            required
            value={form.taxId}
            onChange={(e) => onFormChange({ ...form, taxId: e.target.value })}
          />
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={form.status ?? 1}
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
