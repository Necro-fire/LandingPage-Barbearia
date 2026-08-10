import { CalendarDays, Clock, CheckCircle2, TrendingUp, AlertCircle, Scissors, User, ChevronRight, Check, X, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfDay, endOfDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import BarberDashboard from "./BarberDashboard";

export default function Dashboard() {
  const { profile, user, roles } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalToday: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    revenueToday: 0,
    revenueMonth: 0
  });
  const [nextAppointments, setNextAppointments] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);

  const isBarber = roles.includes("barber");
  const isClient = roles.includes("client") && roles.length === 1;

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user || isClient || isBarber) return;

      setLoading(true);
      const today = startOfDay(new Date());
      const tonight = endOfDay(new Date());
      const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

      try {
        // Fetch stats
        const [todayRes, monthRes, pendingRes] = await Promise.all([
          supabase.from("appointments").select("*").gte("starts_at", today.toISOString()).lte("starts_at", tonight.toISOString()),
          supabase.from("appointments").select("price").eq("status", "completed").gte("starts_at", firstOfMonth.toISOString()),
          supabase.from("appointments")
            .select(`
              id, starts_at, status,
              service:service_id(name, price),
              client:client_id(full_name, phone),
              barber:barber_id(name)
            `)
            .eq("status", "pending")
            .order("starts_at", { ascending: true })
        ]);

        const todayApps = todayRes.data || [];
        const monthApps = monthRes.data || [];
        
        setStats({
          totalToday: todayApps.length,
          pending: todayApps.filter(a => a.status === 'pending').length,
          confirmed: todayApps.filter(a => a.status === 'confirmed').length,
          completed: todayApps.filter(a => a.status === 'completed').length,
          revenueToday: todayApps.filter(a => a.status === 'completed').reduce((acc, curr) => acc + (curr.price || 0), 0),
          revenueMonth: monthApps.reduce((acc, curr) => acc + (curr.price || 0), 0)
        });

        setPendingRequests(pendingRes.data || []);

        // Next appointments (confirmed/pending for today onwards)
        const { data: next } = await supabase
          .from("appointments")
          .select(`
            id, starts_at, status,
            service:service_id(name),
            client:client_id(full_name),
            barber:barber_id(name)
          `)
          .in("status", ["confirmed", "pending"])
          .gte("starts_at", new Date().toISOString())
          .order("starts_at", { ascending: true })
          .limit(5);
        
        setNextAppointments(next || []);

        // Popular services
        const { data: services } = await supabase
          .from("appointments")
          .select("service:service_id(name)")
          .eq("status", "completed");
        
        const counts: Record<string, number> = {};
        services?.forEach(s => {
          const name = (s.service as any)?.name || "Desconhecido";
          counts[name] = (counts[name] || 0) + 1;
        });

        const sortedServices = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        
        setPopularServices(sortedServices);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user, roles, isClient, isBarber]);

  const handleStatusUpdate = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId);

    if (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
    } else {
      setPendingRequests(prev => prev.filter(a => a.id !== appointmentId));
      toast({ 
        title: newStatus === 'confirmed' ? "Agendamento Confirmado" : "Agendamento Recusado",
        description: `O status do agendamento foi atualizado.`
      });
    }
  };

  if (isBarber) return <BarberDashboard />;

  if (isClient) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <PageHeader
            title={`Olá, ${profile?.full_name?.split(" ")[0] ?? user?.email ?? "bem-vindo"}`}
            description="Acompanhe seus agendamentos e preferências."
          />
          <Button onClick={() => navigate("/agendamento")} className="w-full rounded-xl gap-2 shadow-lg shadow-primary/20 md:w-auto">
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
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <PageHeader
        title={`Olá, ${profile?.full_name?.split(" ")[0] ?? user?.email ?? "bem-vindo"}`}
        description="Visão geral da operação da sua barbearia hoje."
      />

      {/* 4. Resumo do Dia */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Agendamentos Hoje" value={loading ? "..." : stats.totalToday.toString()} icon={CalendarDays} />
        <StatCard label="Pendentes" value={loading ? "..." : stats.pending.toString()} icon={Clock} />
        <StatCard label="Confirmados" value={loading ? "..." : stats.confirmed.toString()} icon={CheckCircle2} />
        <StatCard label="Concluídos" value={loading ? "..." : stats.completed.toString()} icon={Scissors} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 5. Próximos Agendamentos */}
        <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/40">
            <CardTitle className="text-lg font-heading">Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando agendamentos...</div>
            ) : nextAppointments.length > 0 ? (
              <div className="divide-y divide-border/40">
                {nextAppointments.map((app) => (
                  <div key={app.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs",
                        app.status === 'confirmed' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        {format(new Date(app.starts_at), "HH:mm")}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{app.client?.full_name || "Cliente"}</p>
                        <p className="text-xs text-muted-foreground">{app.service?.name} • {(app.barber as any)?.name}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[10px] uppercase",
                      app.status === 'confirmed' ? "border-green-500/50 text-green-500" : "border-amber-500/50 text-amber-500"
                    )}>
                      {app.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground italic">Nenhum agendamento para hoje.</div>
            )}
            <div className="p-4 bg-muted/10">
               <Button variant="ghost" className="w-full text-xs" onClick={() => navigate("/app/agenda")}>
                 Ver agenda completa <ChevronRight className="ml-1 h-3 w-3" />
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* 8. Indicadores Financeiros */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Receita Hoje</p>
                    <p className="text-lg font-bold">R$ {stats.revenueToday.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Receita no Mês</p>
                    <p className="text-lg font-bold">R$ {stats.revenueMonth.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 9. Serviços Mais Realizados */}
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading uppercase text-muted-foreground">Serviços Populares</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/40">
                  {popularServices.map((service, idx) => (
                    <div key={service.name} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">{idx + 1}.</span>
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded-full">{service.count} atend.</span>
                    </div>
                  ))}
                  {popularServices.length === 0 && (
                    <p className="p-4 text-xs text-muted-foreground italic text-center">Aguardando dados...</p>
                  )}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* 6. Solicitações Pendentes */}
        <Card className="lg:col-span-3 rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/30">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" /> Solicitações que precisam de atenção
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingRequests.length > 0 ? (
              <div className="divide-y divide-border/40">
                {pendingRequests.map((app) => (
                  <div key={app.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold leading-none">{app.client?.full_name || "Cliente"}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.service?.name} • R$ {(app.service as any)?.price}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] py-0 h-5 border-amber-500/50 text-amber-500 bg-amber-500/5">
                            {format(new Date(app.starts_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">Barbeiro: {(app.barber as any)?.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                      >
                        <X className="h-4 w-4 mr-1" /> Recusar
                      </Button>
                      <Button 
                        size="sm" 
                        className="rounded-lg bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusUpdate(app.id, 'confirmed')}
                      >
                        <Check className="h-4 w-4 mr-1" /> Aprovar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <Check className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground italic">Nenhuma solicitação pendente no momento.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
