export interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Raised elevation for emphasis (Microsoft-style floating cards) */
  elevated?: boolean;
}

export function Card({ children, className = "", elevated = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200/50 bg-white shadow-ms-card transition-all duration-300 ${
        elevated ? "shadow-card-hover" : "hover:shadow-ms-card-hover"
      } ${className}`}
    >
      {children}
    </div>
  );
}
