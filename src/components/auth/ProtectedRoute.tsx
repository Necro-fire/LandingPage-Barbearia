import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/common/Loading";
import { EmptyState } from "@/components/common/EmptyState";
import { ShieldAlert } from "lucide-react";
import type { Permission } from "@/lib/permissions";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: Permission;
}

export function ProtectedRoute({ children, permission }: ProtectedRouteProps) {
  const { session, loading, can } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!session) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (permission && !can(permission)) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Acesso restrito"
        description="Você não possui permissão para acessar este módulo. Fale com um administrador."
      />
    );
  }

  return <>{children}</>;
}
