"use client";

import { Button } from "./Button";

export interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

export function Pagination({
  pageNumber,
  totalPages,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  onPrevious,
  onNext,
  className = "",
}: PaginationProps) {
  return (
    <div
      className={`flex items-center justify-between border-t border-slate-200 pt-4 ${className}`}
    >
      <p className="text-sm text-slate-600">
        Page {pageNumber} of {totalPages} ({totalCount} total)
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={!hasPreviousPage}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button variant="secondary" disabled={!hasNextPage} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
