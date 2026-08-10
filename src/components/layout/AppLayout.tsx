import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { MobileNav } from "./MobileNav";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
          <AppFooter />
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
