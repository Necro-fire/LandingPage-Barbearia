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
        supabase.from("appointments").select("id", { count: "exact" }).eq("status", "pending").gte("starts_at", todayStart.toISOString()).lt("starts_at", todayEnd.toISOString()),
        supabase.from("appointments")
          .select("*, service:service_id(name), client:client_id(full_name), barber:barber_id(display_name)")
          .gte("starts_at", new Date().toISOString())
          .neq("status", "cancelled")
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
        description="Acompanhe as solicitações de agendamento em tempo real."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Agendamentos de Hoje</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{loading ? "..." : "18"}</div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tight font-medium">Agendamentos previstos</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pendentes</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{loading ? "..." : stats.pending}</div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tight font-medium">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confirmados</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{loading ? "..." : "10"}</div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tight font-medium">Agendamentos confirmados</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Concluídos</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Scissors className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{loading ? "..." : "6"}</div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tight font-medium">Atendimentos realizados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-tight text-slate-900">Próximos Agendamentos</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-primary hover:text-primary/80">Ver todos</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {nextAppointments.length > 0 ? (
              <div className="divide-y divide-border/40">
                {nextAppointments.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-blue-500">
                        <Clock className="h-4 w-4" />
                        <span className="font-bold text-sm tracking-tight">
                          {format(new Date(app.starts_at), "HH:mm")}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{app.client?.full_name || app.guest_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <span className="text-xs text-slate-500 font-medium">{app.service?.name}</span>
                      <span className="text-xs text-slate-500 font-medium">{app.barber?.display_name}</span>
                      <Badge className="bg-green-50 text-green-600 hover:bg-green-100 border-none px-3 py-0.5 rounded-full text-[10px] font-bold">Confirmado</Badge>
                    </div>
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

        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-tight text-slate-900">Solicitações Pendentes</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-primary hover:text-primary/80">Ver todas</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {latestRequests.length > 0 ? (
              <div className="divide-y divide-border/40">
                {latestRequests.map((req) => (
                  <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0">
                    <div className="grid grid-cols-3 flex-1 gap-4 items-center">
                      <p className="font-bold text-sm text-slate-900">{req.client?.full_name || req.guest_name}</p>
                      <p className="text-xs text-slate-500 font-medium">{req.service?.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{format(new Date(req.starts_at), "dd/MM - HH:mm")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                        onClick={() => handleQuickAction(req.id, 'confirmed')}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        onClick={() => handleQuickAction(req.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100"
                      >
                        <Eye className="h-4 w-4" />
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
