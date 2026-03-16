"use client";

import { ArrowRight } from "lucide-react";
import { DrawerForm } from "@/components/ui/DrawerForm";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { NativeSelect as Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { CreateEntityLocationRequest } from "@/lib/services/entityLocations";
import type { EntityLookupDto } from "@/lib/services/lookups";

function entityToOption(e: EntityLookupDto) {
  return { value: e.id, label: e.displayName };
}

export interface EntityLocationFormModalProps {
  open: boolean;
  onClose: () => void;
  editId: string | null;
  form: CreateEntityLocationRequest;
  onFormChange: (form: CreateEntityLocationRequest) => void;
  entities: EntityLookupDto[];
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function EntityLocationFormModal({
  open,
  onClose,
  editId,
  form,
  onFormChange,
  entities,
  onSubmit,
  loading,
  error,
}: EntityLocationFormModalProps) {
  const entityOptions = entities.map(entityToOption);

  return (
    <DrawerForm
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editId ? "Edit Location" : "Add Location"}
      footer={
        <div className="flex flex-1 justify-start gap-3">
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={loading}
            className="h-10 rounded-[5px] px-[18px] py-3 bg-[#0066CC] hover:bg-[#0066CC]/90 text-white font-aileron text-[14px]"
          >
            {loading ? "Saving…" : (
              <>
                {editId ? "Update" : "Add Location"} <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="h-10 px-[18px] py-3 rounded-[5px] border-[#E2E8F0] font-aileron text-[14px] text-[#2A2C33]"
          >
            Cancel
          </Button>
        </div>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {error && (
          <div className="mb-4 rounded-[5px]">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Select
            label={
              <span className="font-['Aileron'] text-[14px] font-normal leading-[100%] tracking-normal text-[#2A2C33]">
                Entity
              </span>
            }
            required
            options={entityOptions}
            value={form.entityId}
            onChange={(e) => onFormChange({ ...form, entityId: e.target.value })}
          />
          <Input
            label={
              <span className="font-['Aileron'] text-[14px] font-normal leading-[100%] tracking-normal text-[#2A2C33]">
                Location Name
              </span>
            }
            required
            value={form.locationName}
            onChange={(e) => onFormChange({ ...form, locationName: e.target.value })}
          />
          <Input
            label={
              <span className="font-['Aileron'] text-[14px] font-normal leading-[100%] tracking-normal text-[#2A2C33]">
                Location type
              </span>
            }
            required
            value={form.locationType}
            onChange={(e) => onFormChange({ ...form, locationType: e.target.value })}
          />
          <Input
            label={
              <span className="font-['Aileron'] text-[14px] font-normal leading-[100%] tracking-normal text-[#2A2C33]">
                Physical address
              </span>
            }
            value={form.physicalAddress ?? ""}
            onChange={(e) => onFormChange({ ...form, physicalAddress: e.target.value })}
          />
          <Input
            label={
              <span className="font-['Aileron'] text-[14px] font-normal leading-[100%] tracking-normal text-[#2A2C33]">
                POS code
              </span>
            }
            value={form.posCode ?? ""}
            onChange={(e) => onFormChange({ ...form, posCode: e.target.value })}
          />
          {/* <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) => onFormChange({ ...form, isActive: e.target.checked })}
              className="rounded border-input"
            />
            <span className="text-sm text-foreground">Active</span>
          </label> */}
        </div>
      </form>
    </DrawerForm>
  );
}
