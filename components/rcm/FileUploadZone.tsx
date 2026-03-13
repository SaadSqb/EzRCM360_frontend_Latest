"use client";

import { useRef, useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";

const ACCEPT = ".xlsx,.xls";

export interface FileUploadZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  label?: string;
  hint?: string;
  multiple?: boolean;
}

export function FileUploadZone({
  onFiles,
  accept = ACCEPT,
  label = "Drag and Drop",
  hint = "Accepted formats: XLSX, XLS",
  multiple = false,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const arr = Array.from(files).filter(
        (f) => f.name.endsWith(".xlsx") || f.name.endsWith(".xls")
      );
      if (arr.length) onFiles(multiple ? arr : [arr[0]]);
    },
    [onFiles, multiple]
  );

  return (
    <div className="space-y-2 animate-fade-in">
      <p className="text-sm text-muted-foreground">{hint}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-all duration-300 ease-out ${
          drag
            ? "scale-[1.02] border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10"
            : "border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md active:scale-[0.99]"
        }`}
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full  ${
            drag ? "scale-110" : ""
          }`}
        >
          <img src="/icons/svg/upload-cloud.svg" alt="" className="h-12 w-12 object-contain" />
        </div>
        <p className="text-[12px] font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-[#D1D5DC]">---------- OR ----------</p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-shadow hover:bg-primary/90">
          Browse File
          <ArrowRight className="h-4 w-4 shrink-0" />
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
