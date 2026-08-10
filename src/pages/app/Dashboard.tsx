import { CalendarDays, Scissors, Users, Wallet, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BarberDashboard from "./BarberDashboard";

export default function Dashboard() {
  const { profile, user, roles } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, clients: 0 });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [appToday, clientsCount, recent] = await Promise.all([
        supabase
          .from("appointments")
          .select("id", { count: "exact" })
          .gte("starts_at", today.toISOString())
          .lt("starts_at", new Date(today.getTime() + 86400000).toISOString()),
        supabase
          .from("profiles")
          .select("id", { count: "exact" }),
        supabase
          .from("appointments")
          .select(`
            id,
            starts_at,
            status,
            service:service_id(name),
            client:client_id(full_name)
          `)
          .order("starts_at", { ascending: false })
          .limit(5)
      ]);

      setStats({
        appointments: appToday.count || 0,
        clients: clientsCount.count || 0
      });
      setRecentAppointments(recent.data || []);
      setLoading(false);
    }

    if (!isClient && !isBarber) {
      fetchStats();
    }
  }, [roles]);

  const isClient = roles.includes("client") && roles.length === 1;
  const isBarber = roles.includes("barber");

  if (isBarber) {
    return <BarberDashboard />;
  }

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
        description="Acompanhe o status geral da sua barbearia."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Agendamentos hoje" value="—" hint="Horários marcados para hoje" icon={CalendarDays} />
        <StatCard label="Total de Clientes" value="—" hint="Base de dados ON-TESTE" icon={Users} />
        <StatCard label="Notificações" value="—" hint="Alertas do sistema" icon={Wallet} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/40">
            <CardTitle className="text-lg font-heading">Horários e Disponibilidade</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[300px] flex items-center justify-center text-muted-foreground italic">
            Visualização rápida da agenda (Sincronizando...)
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="w-full justify-start rounded-xl gap-2 border-border/60" onClick={() => navigate("/app/agenda")}>
                <CalendarDays className="h-4 w-4" /> Ver Agenda Geral
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl gap-2 border-border/60" onClick={() => navigate("/app/clientes")}>
                <Users className="h-4 w-4" /> Histórico de Clientes
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl gap-2 border-border/60" onClick={() => navigate("/app/servicos")}>
                <Scissors className="h-4 w-4" /> Tipos de Corte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
