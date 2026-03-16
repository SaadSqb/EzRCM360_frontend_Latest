"use client";

import Link from "next/link";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-12 border-t border-border bg-background flex items-center justify-between px-6 text-sm text-muted-foreground">
      <p>
        Copyright &copy;{currentYear} EzTechMedia, LLC. All Rights Reserved. Unauthorized use or reproduction is prohibited.
      </p>
      <div className="flex items-center gap-1">
        <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
          Terms of Service
        </Link>
        <span>&bull;</span>
        <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <span>&bull;</span>
        <Link href="/compliance-disclaimer" className="hover:text-foreground transition-colors">
          Compliance Disclaimer
        </Link>
      </div>
    </footer>
  );
}
