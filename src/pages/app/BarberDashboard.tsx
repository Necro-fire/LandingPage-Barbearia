import { useState, useEffect } from "react";
import { 
  CalendarDays, 
  Check, 
  X, 
  Clock, 
  User, 
  Scissors, 
  TrendingUp, 
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronRight
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BarberDashboard() {
  const { user, profile } = useAuth();
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    monthRevenue: 0,
    customerCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBarberData() {
      if (!user) return;

      // First find the barber entry for this user
      const { data: barber } = await supabase
        .from("barbers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!barber) {
        setLoading(false);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [pendingRes, allRes] = await Promise.all([
        supabase
          .from("appointments")
          .select(`
            *,
            service:service_id(name, price),
            client:client_id(full_name, phone)
          `)
          .eq("barber_id", barber.id)
          .eq("status", "pending")
          .order("starts_at", { ascending: true }),
        supabase
          .from("appointments")
          .select("starts_at, price, status")
          .eq("barber_id", barber.id)
      ]);

      if (pendingRes.data) setPendingAppointments(pendingRes.data);
      
      if (allRes.data) {
        const todayCount = allRes.data.filter(a => 
          new Date(a.starts_at).toDateString() === new Date().toDateString() && 
          a.status !== 'cancelled'
        ).length;
        
        const monthRevenue = allRes.data
          .filter(a => new Date(a.starts_at).getMonth() === new Date().getMonth() && a.status === 'completed')
          .reduce((acc, curr) => acc + (curr.price || 0), 0);

        setStats({
          todayCount,
          monthRevenue,
          customerCount: 0 // Will be implemented with full stats module
        });
      }
      
      setLoading(false);
    }

    fetchBarberData();
  }, [user]);

  const handleStatusUpdate = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId);

    if (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
    } else {
      setPendingAppointments(prev => prev.filter(a => a.id !== appointmentId));
      toast({ 
        title: newStatus === 'confirmed' ? "Agendamento Confirmado" : "Agendamento Recusado",
        description: `O status do agendamento foi atualizado.`
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title={`Painel do Barbeiro — ${profile?.full_name?.split(" ")[0] || "Profissional"}`}
        description="Gerencie suas solicitações e acompanhe seu desempenho."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Agenda de Hoje" 
          value={stats.todayCount.toString()} 
          hint="Serviços marcados para hoje" 
          icon={CalendarDays} 
        />
        <StatCard 
          label="Clientes Atendidos" 
          value={stats.customerCount.toString()} 
          hint="Total de clientes únicos" 
          icon={User} 
        />
        <StatCard 
          label="Receita Mensal" 
          value={`R$ ${stats.monthRevenue}`} 
          hint="Apenas serviços concluídos" 
          icon={TrendingUp} 
        />
        <StatCard 
          label="Solicitações" 
          value={pendingAppointments.length.toString()} 
          hint="Aguardando sua aprovação" 
          icon={AlertCircle} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Requests */}
        <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/30">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" /> Solicitações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingAppointments.length > 0 ? (
              <div className="divide-y divide-border/40">
                {pendingAppointments.map((app) => (
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
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] py-0 h-5 border-amber-500/50 text-amber-500 bg-amber-500/5">
                            {format(new Date(app.starts_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{app.client?.phone}</span>
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

        {/* Quick Actions / Schedule Preview */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="w-full justify-start rounded-xl gap-2 border-border/60" onClick={() => window.location.href = '/app/agenda'}>
                <CalendarIcon className="h-4 w-4" /> Ver Agenda Completa
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl gap-2 border-border/60">
                <AlertCircle className="h-4 w-4" /> Bloquear Horário
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl gap-2 border-border/60">
                <Scissors className="h-4 w-4" /> Meus Serviços
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading">Próximos Clientes</CardTitle>
                <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-wider">Ver todos</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/40">
                  <div className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">JD</div>
                      <div>
                        <p className="text-sm font-bold leading-none">João D. <span className="text-[10px] font-normal text-muted-foreground ml-1">às 14:00</span></p>
                        <p className="text-[10px] text-muted-foreground mt-1">Corte Degradê</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">RM</div>
                      <div>
                        <p className="text-sm font-bold leading-none">Ricardo M. <span className="text-[10px] font-normal text-muted-foreground ml-1">às 15:30</span></p>
                        <p className="text-[10px] text-muted-foreground mt-1">Barba Express</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
