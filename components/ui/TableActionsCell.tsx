"use client";

import { Pencil, Trash2 } from "lucide-react";

interface TableActionsCellProps {
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  editLabel?: string;
  deleteLabel?: string;
}

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
    <div className="flex items-center gap-3">
      {showEdit && (
        <button
          onClick={onEdit}
          className="text-[#64748B] hover:text-[#202830] transition-colors"
          aria-label={editLabel}
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      {showDelete && (
        <button
          onClick={onDelete}
          className="text-[#64748B] hover:text-[#EF4444] transition-colors"
          aria-label={deleteLabel}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
