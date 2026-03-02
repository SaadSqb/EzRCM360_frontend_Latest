import { MainLayout } from "@/components/layout/MainLayout";
import { MfaRouteGuard } from "@/components/auth/MfaRouteGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MfaRouteGuard>
      <MainLayout>{children}</MainLayout>
    </MfaRouteGuard>
  );
}
