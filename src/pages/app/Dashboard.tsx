import { CalendarDays, Scissors, Users, Wallet } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { profile, user, roles } = useAuth();
  const navigate = useNavigate();

  const isClient = roles.includes("client") && roles.length === 1;

  if (isClient) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <PageHeader
            title={`Olá, ${profile?.full_name?.split(" ")[0] ?? user?.email ?? "bem-vindo"}`}
            description="Acompanhe seus agendamentos e preferências."
          />
          <Button onClick={() => navigate("/app/agendar")} className="rounded-xl gap-2 shadow-lg shadow-primary/20">
            <CalendarDays className="h-4 w-4" /> Novo Agendamento
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Próximo Agendamento"
            value="Nenhum"
            hint="Você ainda não possui horários marcados"
            icon={CalendarDays}
          />
          <StatCard
            label="Pontos Fidelidade"
            value="0"
            hint="Acumule pontos em cada serviço"
            icon={Scissors}
          />
          <StatCard
            label="Notificações"
            value="0"
            hint="Nenhuma mensagem nova"
            icon={Wallet}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Histórico Recente</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Nenhum serviço realizado recentemente.
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Suas Preferências</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Personalize sua experiência na barbearia.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title={`Olá, ${profile?.full_name?.split(" ")[0] ?? user?.email ?? "bem-vindo"}`}
        description={`Perfil de acesso: ${roles.map((r) => ROLE_LABELS[r]).join(", ") || "—"}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Agendamentos hoje" value="—" hint="Aguardando módulo de agenda" icon={CalendarDays} />
        <StatCard label="Clientes" value="—" hint="Aguardando módulo de clientes" icon={Users} />
        <StatCard label="Serviços ativos" value="—" hint="Aguardando módulo de serviços" icon={Scissors} />
        <StatCard label="Faturamento" value="—" hint="Aguardando módulo financeiro" icon={Wallet} />
      </div>

      <Card className="mt-6 rounded-2xl border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Estrutura base concluída</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Layout, navegação, permissões, temas, componentes reutilizáveis e banco de dados estão prontos.</p>
          <p>Os próximos módulos serão adicionados sobre esta base, sem alterar o que já existe.</p>
        </CardContent>
      </Card>
    </div>
  );
}
