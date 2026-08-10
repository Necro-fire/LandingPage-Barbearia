import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import AppLayout from "@/components/layout/AppLayout";

import Auth from "./pages/Auth.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/app/Dashboard.tsx";
import Profile from "./pages/app/Profile.tsx";
import {
  SettingsPage,
} from "./pages/app/Modules.tsx";
import Notifications from "./pages/app/Notifications.tsx";
import Booking from "./pages/app/Booking.tsx";
import Schedule from "./pages/app/Schedule.tsx";
import Clients from "./pages/app/Clients.tsx";
import Services from "./pages/app/Services.tsx";

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
                {/* Public Booking Page */}
                <Route path="/" element={<Navigate to="/app" replace />} />
                <Route path="/agendamento" element={<Booking />} />
                
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                {/* Private Owner Part */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route
                    path="agenda"
                    element={<ProtectedRoute permission="schedule.view"><Schedule /></ProtectedRoute>}
                  />
                  <Route
                    path="clientes"
                    element={<ProtectedRoute permission="clients.view"><Clients /></ProtectedRoute>}
                  />
                  <Route
                    path="servicos"
                    element={<ProtectedRoute permission="services.manage"><Services /></ProtectedRoute>}
                  />
                  <Route
                    path="notificacoes"
                    element={<ProtectedRoute permission="notifications.view"><Notifications /></ProtectedRoute>}
                  />
                  <Route path="perfil" element={<Profile />} />
                </Route>

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
