"use client";

import { Button } from "@/components/ui/Button";

interface TableActionsCellProps {
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  editLabel?: string;
  deleteLabel?: string;
}

/** Spacious action buttons for table rows – avoids cramped Edit/Delete. */
export function TableActionsCell({
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: TableActionsCellProps) {
  const showEdit = canEdit && onEdit;
  const showDelete = canDelete && onDelete;
  if (!showEdit && !showDelete) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showEdit && (
        <Button variant="secondary" className="min-w-[72px]" onClick={onEdit}>
          {editLabel}
        </Button>
      )}
      {showDelete && (
        <Button variant="danger" className="min-w-[72px]" onClick={onDelete}>
          {deleteLabel}
        </Button>
      )}
    </div>
  );
}
