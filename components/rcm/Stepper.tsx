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
      <div className="w-full rounded-xl border border-[#E2E8F0] bg-[#F5F6F7] px-4 py-6 sm:px-6">
        <div className="flex w-full items-stretch justify-between gap-0">
          {steps.map((step, i) => (
            <div key={step.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex w-full flex-col items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-[14px] font-['Aileron'] font-semibold transition-all duration-300 ease-out ${
                    step.completed
                      ? "border-[#0066CC] bg-[#0066CC] text-white shadow-sm"
                      : step.active
                        ? "border-[#0066CC] text-[#0066CC] bg-white shadow-[0_0_0_6px_rgba(0,102,204,0.1)]"
                        : "border-[#E2E8F0] bg-white text-muted-foreground"
                  }`}
                >
                  {step.completed ? (
                    <svg
                      className="h-5 w-5 animate-scale-in"
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
                    <span>{String(step.id).padStart(2, "0")}</span>
                  )}
                </div>
                <span
                  className={`mt-3 text-center text-[14px] font-['Aileron'] leading-tight ${
                    step.active
                      ? "text-foreground font-medium"
                      : step.completed
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 mt-5 min-w-[24px] flex-1 self-start sm:mx-4 h-[2px] ${
                    step.completed ? "bg-[#0066CC]" : "bg-[#E2E8F0]"
                  }`}
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
