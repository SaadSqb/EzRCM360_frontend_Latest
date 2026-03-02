"use client";

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className={`min-w-full divide-y divide-border ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-muted/50">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border bg-card">{children}</tbody>;
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
    <tr className={`transition-colors duration-200 hover:bg-muted/30 ${className}`} style={style}>
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
      className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${align === "right" ? "text-right" : "text-left"} ${className}`}
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
      className={`px-5 py-4 text-sm text-foreground ${align === "right" ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </td>
  );
}
