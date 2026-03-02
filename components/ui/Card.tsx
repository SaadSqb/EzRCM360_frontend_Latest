export interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Raised elevation for emphasis (Microsoft-style floating cards) */
  elevated?: boolean;
}

export function Card({ children, className = "", elevated = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200/60 bg-white transition-all duration-300 ${
        elevated
          ? "shadow-[var(--shadow-card-hover)]"
          : "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
