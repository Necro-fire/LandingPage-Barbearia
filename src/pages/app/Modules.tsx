import { PageHeader } from "@/components/common/PageHeader";

export const Appointments = () => (
  <div className="space-y-6">
    <PageHeader title="Agendamentos" description="Gerencie as solicitações e horários marcados." />
    <div className="p-10 border border-dashed rounded-2xl text-center text-muted-foreground">
      Módulo de agendamentos em desenvolvimento.
    </div>
  </div>
);

export const Barbers = () => (
  <div className="space-y-6">
    <PageHeader title="Barbeiros" description="Gestão da equipe e perfis profissionais." />
    <div className="p-10 border border-dashed rounded-2xl text-center text-muted-foreground">
      Módulo de barbeiros em desenvolvimento.
    </div>
  </div>
);

export const SettingsPage = () => (
  <div className="space-y-6">
    <PageHeader title="Configurações" description="Ajustes gerais do sistema e da barbearia." />
    <div className="p-10 border border-dashed rounded-2xl text-center text-muted-foreground">
      Módulo de configurações em desenvolvimento.
    </div>
  </div>
);

export const Audit = () => (
  <div className="space-y-6">
    <PageHeader title="Auditoria" description="Registro de atividades e logs de segurança." />
    <div className="p-10 border border-dashed rounded-2xl text-center text-muted-foreground">
      Módulo de auditoria em desenvolvimento.
    </div>
  </div>
);
