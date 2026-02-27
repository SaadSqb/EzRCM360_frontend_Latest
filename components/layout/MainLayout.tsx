import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NavigationProgress } from "./NavigationProgress";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <NavigationProgress />
      <Sidebar />
      <div className="pl-64 flex min-h-screen flex-col transition-all duration-200">
        <Header />
        <main className="flex-1 p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
