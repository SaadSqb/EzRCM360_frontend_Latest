import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProviderWithToaster } from "@/components/providers/ToastProviderWithToaster";
import { PermissionsProvider } from "@/lib/contexts/PermissionsContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EzRCM360 - Settings & Configurations",
  description: "Settings and configurations portal for EzRCM360",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastProviderWithToaster>
          <AuthGuard>
            <PermissionsProvider>{children}</PermissionsProvider>
          </AuthGuard>
        </ToastProviderWithToaster>
      </body>
    </html>
  );
}
