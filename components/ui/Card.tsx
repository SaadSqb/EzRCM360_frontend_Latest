export interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Raised elevation for emphasis (enterprise-style) */
  elevated?: boolean;
}

export function Card({ children, className = "", elevated = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white p-6 shadow-card transition-shadow duration-150 ${
        elevated ? "shadow-md hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
