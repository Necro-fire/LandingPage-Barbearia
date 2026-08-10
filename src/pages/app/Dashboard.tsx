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
    totalPending: 0,
    pendingToday: 0
  });
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const isBarber = roles.includes("barber");
  const isClient = roles.includes("client") && roles.length === 1;

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user || isClient || isBarber) return;

      setLoading(true);
      const today = startOfDay(new Date());
      const tonight = endOfDay(new Date());

      try {
        const [totalPendingRes, pendingTodayRes] = await Promise.all([
          supabase.from("appointments")
            .select(`
              id, starts_at, status,
              service:service_id(name, price),
              client:client_id(full_name, phone),
              barber:barber_id(name)
            `)
            .eq("status", "pending")
            .order("starts_at", { ascending: true }),
          supabase.from("appointments")
            .select("id")
            .eq("status", "pending")
            .gte("starts_at", today.toISOString())
            .lte("starts_at", tonight.toISOString())
        ]);

        const totalPending = totalPendingRes.data || [];
        const pendingToday = pendingTodayRes.data || [];
        
        setStats({
          totalPending: totalPending.length,
          pendingToday: pendingToday.length
        });

        setPendingRequests(totalPending);

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
        description="Agendamentos que precisam de atenção."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard 
          label="Agendamentos Pendentes" 
          value={loading ? "..." : stats.totalPending.toString()} 
          hint="Total de solicitações aguardando aprovação"
          icon={Clock} 
        />
        <StatCard 
          label="Pendentes Hoje" 
          value={loading ? "..." : stats.pendingToday.toString()} 
          hint="Solicitações pendentes para a data atual"
          icon={CalendarDays} 
        />
      </div>

      <div className="grid gap-6">
        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/30">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" /> Agendamentos Pendentes
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
                          {app.service?.name} • R$ {app.service?.price}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] py-0 h-5 border-amber-500/50 text-amber-500 bg-amber-500/5">
                            {format(new Date(app.starts_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Profissional: {app.barber?.name}</span>
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
