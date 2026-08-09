import {
  BarChart3,
  Bell,
  CalendarDays,
  CalendarRange,
  Gift,
  ScrollText,
  Scissors,
  Settings,
  Users,
  Wallet,
  UserCheck,
} from "lucide-react";
import { ModulePlaceholder } from "./ModulePlaceholder";

export const Appointments = () => (
  <ModulePlaceholder title="Agendamentos" description="Gestão de horários marcados pelos clientes." icon={CalendarDays} />
);
export const Schedule = () => (
  <ModulePlaceholder title="Agenda" description="Visão de agenda inteligente por barbeiro e período." icon={CalendarRange} />
);
export const Barbers = () => (
  <ModulePlaceholder title="Barbeiros" description="Gestão de profissionais, comissões e horários." icon={UserCheck} />
);
export const Finance = () => (
  <ModulePlaceholder title="Financeiro" description="Entradas, saídas, comissões e formas de pagamento." icon={Wallet} />
);
export const Reports = () => (
  <ModulePlaceholder title="Relatórios" description="Indicadores de desempenho e exportações." icon={BarChart3} />
);
export const Loyalty = () => (
  <ModulePlaceholder title="Fidelização" description="Pontos, recompensas e campanhas de retenção." icon={Gift} />
);
export const Notifications = () => (
  <ModulePlaceholder title="Notificações" description="Central de avisos e alertas do sistema." icon={Bell} />
);
export const SettingsPage = () => (
  <ModulePlaceholder title="Configurações" description="Preferências gerais, horários e integrações." icon={Settings} />
);
export const Audit = () => (
  <ModulePlaceholder title="Auditoria" description="Trilha de ações realizadas no sistema." icon={ScrollText} />
);
