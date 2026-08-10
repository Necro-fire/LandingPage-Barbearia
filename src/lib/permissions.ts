export type AppRole = "admin" | "barber" | "client" | "receptionist" | "manager" | "owner";

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrador",
  barber: "Barbeiro",
  client: "Cliente",
  receptionist: "Recepcionista",
  manager: "Gerente",
  owner: "Proprietário",
};

/** Permissões atômicas do sistema. Módulos futuros apenas consomem estas chaves. */
export type Permission =
  | "dashboard.view"
  | "appointments.view"
  | "appointments.manage"
  | "schedule.view"
  | "schedule.manage"
  | "clients.view"
  | "clients.manage"
  | "services.manage"
  | "barbers.manage"
  | "finance.view"
  | "finance.manage"
  | "reports.view"
  | "loyalty.view"
  | "loyalty.manage"
  | "notifications.view"
  | "settings.manage"
  | "audit.view";

const CLIENT: Permission[] = [
  "dashboard.view",
  "appointments.view",
  "loyalty.view",
  "notifications.view",
];

const BARBER: Permission[] = [
  ...CLIENT,
  "appointments.manage",
  "schedule.view",
  "schedule.manage",
  "clients.view",
  "finance.view",
];

const ADMIN: Permission[] = [
  ...BARBER,
  "clients.manage",
  "services.manage",
  "barbers.manage",
  "finance.manage",
  "reports.view",
  "loyalty.manage",
  "settings.manage",
  "audit.view",
];

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  client: CLIENT,
  barber: BARBER,
  receptionist: BARBER, // Por enquanto herda barbeiro
  manager: ADMIN,
  owner: ADMIN,
  admin: ADMIN,
};

export function can(roles: AppRole[] | undefined, permission: Permission): boolean {
  // Conceder acesso total a qualquer usuário logado (com roles atribuídas)
  return !!roles?.length;
}

export function hasRole(roles: AppRole[] | undefined, role: AppRole): boolean {
  return !!roles?.includes(role);
}
