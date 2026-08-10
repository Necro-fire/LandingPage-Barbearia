import {
  BarChart3,
  Bell,
  CalendarDays,
  CalendarRange,
  Gift,
  LayoutDashboard,
  Scissors,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Permission } from "./permissions";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  permission: Permission;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Administração",
    items: [
      { title: "Dashboard", url: "/app", icon: LayoutDashboard, permission: "dashboard.view" },
      { title: "Agenda", url: "/app/agenda", icon: CalendarRange, permission: "schedule.view" },
      { title: "Clientes", url: "/app/clientes", icon: Users, permission: "clients.view" },
      { title: "Notificações", url: "/app/notificacoes", icon: Bell, permission: "notifications.view" },
      { title: "Serviços", url: "/app/servicos", icon: Scissors, permission: "services.manage" },
      { title: "Página da Barbearia", url: "/agendamento", icon: CalendarDays, permission: "dashboard.view" },
    ],
  },
];
