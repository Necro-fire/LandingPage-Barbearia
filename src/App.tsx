import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/app/Dashboard.tsx";
import Profile from "./pages/app/Profile.tsx";
import {
  Appointments,
  Audit,
  Clients,
  Finance,
  Loyalty,
  Notifications,
  Reports,
  Services,
  SettingsPage,
} from "./pages/app/Modules.tsx";
import Booking from "./pages/app/Booking.tsx";
import Schedule from "./pages/app/Schedule.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="perfil" element={<Profile />} />
                   <Route
                    path="agendamentos"
                    element={<ProtectedRoute permission="appointments.view"><Appointments /></ProtectedRoute>}
                  />
                  <Route
                    path="agendar"
                    element={<ProtectedRoute permission="appointments.view"><Booking /></ProtectedRoute>}
                  />
                  <Route
                    path="agenda"
                    element={<ProtectedRoute permission="schedule.view"><Schedule /></ProtectedRoute>}
                  />
                   <Route
                    path="clientes"
                    element={<ProtectedRoute permission="clients.view"><Clients /></ProtectedRoute>}
                  />
                  <Route
                    path="barbeiros"
                    element={<ProtectedRoute permission="barbers.view"><Barbers /></ProtectedRoute>}
                  />
                  <Route
                    path="servicos"
                    element={<ProtectedRoute permission="services.manage"><Services /></ProtectedRoute>}
                  />
                  <Route
                    path="financeiro"
                    element={<ProtectedRoute permission="finance.view"><Finance /></ProtectedRoute>}
                  />
                  <Route
                    path="relatorios"
                    element={<ProtectedRoute permission="reports.view"><Reports /></ProtectedRoute>}
                  />
                  <Route
                    path="fidelidade"
                    element={<ProtectedRoute permission="loyalty.view"><Loyalty /></ProtectedRoute>}
                  />
                  <Route
                    path="notificacoes"
                    element={<ProtectedRoute permission="notifications.view"><Notifications /></ProtectedRoute>}
                  />
                  <Route
                    path="configuracoes"
                    element={<ProtectedRoute permission="settings.manage"><SettingsPage /></ProtectedRoute>}
                  />
                  <Route
                    path="auditoria"
                    element={<ProtectedRoute permission="audit.view"><Audit /></ProtectedRoute>}
                  />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
