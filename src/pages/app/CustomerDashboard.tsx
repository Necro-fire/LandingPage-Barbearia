import { useState, useEffect } from "react";
import { 
  User, 
  Calendar, 
  Scissors, 
  Clock, 
  CheckCircle2, 
  LogOut,
  ChevronRight,
  UserCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/common/Loading";

export default function CustomerDashboard() {
  const { user, profile, signOut } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      if (!user) return;
      setLoading(true);
      const { data } = await supabase
        .from("appointments")
        .select("*, service:service_id(name, price), barber:barber_id(display_name)")
        .eq("client_id", user.id)
        .order("starts_at", { ascending: false });
      
      if (data) setAppointments(data);
      setLoading(false);
    }
    fetchAppointments();
  }, [user]);

  const upcoming = appointments.filter(app => 
    isAfter(new Date(app.starts_at), new Date()) && app.status !== "cancelled"
  ).reverse();
  
  const history = appointments.filter(app => 
    !isAfter(new Date(app.starts_at), new Date()) || app.status === "cancelled" || app.status === "completed"
  );

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-10">
      <header className="sticky top-0 z-30 bg-white/80 border-b border-slate-100 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bem-vindo</p>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{profile?.full_name || user?.email}</h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} className="rounded-xl text-slate-400">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* Próximo Agendamento */}
        <section>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Próximo Agendamento</h3>
          {upcoming.length > 0 ? (
            <Card className="rounded-2xl border-none shadow-sm bg-primary text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="bg-white/20 text-white border-none text-[8px] uppercase font-black tracking-widest mb-2">Confirmado</Badge>
                    <h4 className="text-2xl font-bold uppercase tracking-tight leading-none">{upcoming[0].service?.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Barbeiro</p>
                    <p className="font-bold text-sm uppercase">{upcoming[0].barber?.display_name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 opacity-60" />
                    <span className="text-sm font-bold uppercase tracking-tight">{format(new Date(upcoming[0].starts_at), "dd 'de' MMM", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 opacity-60" />
                    <span className="text-sm font-bold uppercase tracking-tight">{format(new Date(upcoming[0].starts_at), "HH:mm")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white p-10 rounded-2xl border border-slate-100 text-center space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nenhum agendamento futuro.</p>
              <Button onClick={() => window.location.href = '/'} className="rounded-xl bg-primary px-8 h-12 text-[10px] font-black uppercase tracking-widest">Agendar Agora</Button>
            </div>
          )}
        </section>

        {/* Histórico */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Histórico Recente</h3>
          </div>
          <div className="space-y-3">
            {history.length > 0 ? history.map((app) => (
              <Card key={app.id} className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Scissors className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-900">{app.service?.name}</h4>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">
                        {format(new Date(app.starts_at), "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[8px] uppercase font-black tracking-widest",
                    app.status === 'completed' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : "text-slate-400 border-slate-100"
                  )}>
                    {app.status === 'completed' ? 'Concluído' : app.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                  </Badge>
                </CardContent>
              </Card>
            )) : (
              <p className="text-center py-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Histórico vazio.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
