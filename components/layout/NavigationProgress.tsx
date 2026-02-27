"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Thin progress bar at top of viewport during route transitions. */
export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[100] h-0.5 overflow-hidden bg-primary-100"
      aria-hidden
    >
      <div className="h-full w-1/3 animate-progress-indeterminate bg-primary-600" />
    </div>
  );
}
