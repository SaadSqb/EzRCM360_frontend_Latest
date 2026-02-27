"use client";

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-slate-200/60 ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-slate-50/80">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <tr className={`transition-colors duration-150 hover:bg-primary-50/30 ${className}`} style={style}>
      {children}
    </tr>
  );
}

export function TableHeaderCell({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <th
      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 ${align === "right" ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  align = "left",
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={`px-6 py-4 text-sm text-slate-700 ${align === "right" ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </td>
  );
}
