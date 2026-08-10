import { useState, useEffect } from "react";
import { 
  Users, 
  Calendar, 
  Bell, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    today: 0,
  });
  const [nextAppointments, setNextAppointments] = useState<any[]>([]);
  const [latestRequests, setLatestRequests] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayStart.getDate() + 1);

      const [pendingRes, todayRes, nextRes, latestRes] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("appointments").select("id", { count: "exact" }).gte("starts_at", todayStart.toISOString()).lt("starts_at", todayEnd.toISOString()),
        supabase.from("appointments")
          .select("*, service:service_id(name), client:client_id(full_name), barber:barber_id(display_name)")
          .gte("starts_at", new Date().toISOString())
          .order("starts_at", { ascending: true })
          .limit(5),
        supabase.from("appointments")
          .select("*, service:service_id(name), client:client_id(full_name)")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5)
      ]);

      setStats({
        pending: pendingRes.count || 0,
        today: todayRes.count || 0,
      });
      setNextAppointments(nextRes.data || []);
      setLatestRequests(latestRes.data || []);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const handleQuickAction = async (id: string, status: 'confirmed' | 'cancelled') => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (!error) {
      setLatestRequests(prev => prev.filter(req => req.id !== id));
      setStats(prev => ({ ...prev, pending: prev.pending - 1 }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Dashboard" 
        description="Bem-vindo à central de comando da sua barbearia."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur transition-all hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Agendamentos Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-black tracking-tighter text-primary">{loading ? "..." : stats.pending}</div>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur transition-all hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-black tracking-tighter text-foreground">{loading ? "..." : stats.today}</div>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">Total para {format(new Date(), "dd/MM")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Próximos Clientes</CardTitle>
                <CardDescription className="text-[9px] uppercase tracking-wider">Cronograma imediato da barbearia.</CardDescription>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground/50" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {nextAppointments.length > 0 ? (
              <div className="divide-y divide-border/40">
                {nextAppointments.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs uppercase">
                        {format(new Date(app.starts_at), "HH:mm")}
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tighter">{app.client?.full_name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{app.service?.name} • {app.barber?.display_name}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-2 opacity-30">
                <Calendar className="h-8 w-8 mx-auto" />
                <p className="text-[10px] uppercase font-bold tracking-widest italic">Nenhum cliente agendado para as próximas horas.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Solicitações Pendentes</CardTitle>
                <CardDescription className="text-[9px] uppercase tracking-wider">Ações rápidas para aprovar ou negar.</CardDescription>
              </div>
              <Bell className="h-4 w-4 text-muted-foreground/50" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {latestRequests.length > 0 ? (
              <div className="divide-y divide-border/40">
                {latestRequests.map((req) => (
                  <div key={req.id} className="p-4 hover:bg-muted/20 transition-colors space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tighter">{req.client?.full_name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{req.service?.name} — {format(new Date(req.starts_at), "dd/MM 'às' HH:mm")}</p>
                      </div>
                      <Badge variant="outline" className="text-[8px] uppercase font-black border-amber-500/50 text-amber-500 bg-amber-500/5">Pendente</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        onClick={() => handleQuickAction(req.id, 'confirmed')}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1.5" /> Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        onClick={() => handleQuickAction(req.id, 'cancelled')}
                      >
                        <XCircle className="h-3 w-3 mr-1.5" /> Recusar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-2 opacity-30">
                <Bell className="h-8 w-8 mx-auto" />
                <p className="text-[10px] uppercase font-bold tracking-widest italic">Tudo em dia! Nenhuma solicitação pendente.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
