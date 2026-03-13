"use client";

export interface StepperStep {
  id: number;
  label: string;
  completed?: boolean;
  active?: boolean;
}

export function Stepper({ steps }: { steps: StepperStep[] }) {
  return (
    <div className="mb-8 w-full animate-fade-in">
      <div className="w-full rounded-xl">
        <div className="flex w-full items-center">
          {steps.map((s, i) => (
            <div key={s.id} className={`flex min-w-0 items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
              <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-[14px] font-['Aileron'] font-semibold cursor-pointer transition-all duration-300 ease-out ${
                    s.active
                      ? "border-[#0066CC] bg-transparent text-[#0066CC] shadow-[0_0_0_4px_#0066CC1A]"
                      : "border-[#E2E8F0] bg-white text-[#64748B]"
                  }`}
                >
                  {s.completed ? (
                    <svg
                      className="h-5 w-5 text-[#0066CC]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{String(s.id).padStart(2, "0")}</span>
                  )}
                </div>
                <span
                  className={`hidden truncate text-[14px] font-['Aileron'] leading-tight sm:inline ${
                    s.active ? "font-medium text-[#94A3B8]" : "text-[#94A3B8]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="min-h-[2px] mx-3 w-[8rem] flex-1 bg-[#E2E8F0]/70 "
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
        {/* Mobile: labels below */}
        <div className="mt-3 flex justify-between gap-2 sm:hidden">
          {steps.map((s) => (
            <span
              key={s.id}
              className={`min-w-0 flex-1 text-center text-[12px] font-['Aileron'] leading-tight ${
                s.active ? "font-medium text-white" : "text-[#94A3B8]"
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
