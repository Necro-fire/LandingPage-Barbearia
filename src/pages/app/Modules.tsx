import { PageHeader } from "@/components/common/PageHeader";

export const SettingsPage = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <PageHeader 
      title="Configurações" 
      description="Gerencie as preferências do sistema ON-TESTE." 
    />
    <div className="p-10 border border-dashed rounded-2xl text-center text-muted-foreground bg-card/60 backdrop-blur">
      Configurações da conta e do sistema.
    </div>
  </div>
);
