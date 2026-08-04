export type AppRole = "admin" | "barber" | "client";

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrador",
  barber: "Barbeiro",
  client: "Cliente",
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
  admin: ADMIN,
};

export function can(roles: AppRole[] | undefined, permission: Permission): boolean {
  if (!roles?.length) return false;
  return roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
}

export function hasRole(roles: AppRole[] | undefined, role: AppRole): boolean {
  return !!roles?.includes(role);
}
