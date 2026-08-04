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
    label: "Principal",
    items: [
      { title: "Dashboard", url: "/app", icon: LayoutDashboard, permission: "dashboard.view" },
      { title: "Agendamentos", url: "/app/agendamentos", icon: CalendarDays, permission: "appointments.view" },
      { title: "Agenda", url: "/app/agenda", icon: CalendarRange, permission: "schedule.view" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { title: "Clientes", url: "/app/clientes", icon: Users, permission: "clients.view" },
      { title: "Serviços", url: "/app/servicos", icon: Scissors, permission: "services.manage" },
      { title: "Financeiro", url: "/app/financeiro", icon: Wallet, permission: "finance.view" },
      { title: "Relatórios", url: "/app/relatorios", icon: BarChart3, permission: "reports.view" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Fidelidade", url: "/app/fidelidade", icon: Gift, permission: "loyalty.view" },
      { title: "Notificações", url: "/app/notificacoes", icon: Bell, permission: "notifications.view" },
      { title: "Configurações", url: "/app/configuracoes", icon: Settings, permission: "settings.manage" },
      { title: "Auditoria", url: "/app/auditoria", icon: ShieldCheck, permission: "audit.view" },
    ],
  },
];
