"use client";

/**
 * Icon for validation/analysis in progress: magnifying glass over stacked documents.
 * Use during time-taking validation or analysis operations.
 */
export function ValidationAnalysisIcon({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Back document */}
      <rect
        x="14"
        y="12"
        width="36"
        height="44"
        rx="2"
        fill="#dbeafe"
        stroke="#0078d4"
        strokeWidth="1.5"
      />
      {/* Front document */}
      <rect
        x="10"
        y="8"
        width="36"
        height="44"
        rx="2"
        fill="white"
        stroke="#0078d4"
        strokeWidth="1.5"
      />
      {/* Document fold */}
      <path
        d="M42 8 L46 8 L46 12 L42 8 Z"
        fill="#eff6ff"
        stroke="#0078d4"
        strokeWidth="1"
        strokeLinejoin="miter"
      />
      {/* Magnifying glass lens */}
      <circle
        cx="22"
        cy="26"
        r="10"
        fill="#dbeafe"
        stroke="#0078d4"
        strokeWidth="1.5"
      />
      {/* Magnifying glass handle - reddish-orange accent */}
      <path
        d="M29 33 L38 42"
        stroke="#ea580c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
