import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ArrowLeft,
  Scissors,
  Clock
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      
      const [clientRes, appRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
        supabase.from("appointments")
          .select("*, service:service_id(name, price)")
          .eq("client_id", id)
          .order("starts_at", { ascending: false })
      ]);

      if (clientRes.data) setClient(clientRes.data);
      if (appRes.data) setAppointments(appRes.data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse">Carregando detalhes...</div>;
  if (!client) return <div className="p-20 text-center">Cliente não encontrado.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader title={client.full_name} description="Detalhes e histórico completo do cliente." />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nome Completo</p>
              <p className="font-bold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {client.full_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Telefone</p>
              <p className="font-bold flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {client.phone || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</p>
              <p className="font-bold flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {client.email || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data de Cadastro</p>
              <p className="font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {format(new Date(client.created_at), "dd/MM/yyyy")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/40">
            <CardTitle className="text-sm font-black uppercase tracking-widest">Histórico de Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {appointments.length > 0 ? (
              <div className="divide-y divide-border/40">
                {appointments.map((app) => (
                  <div key={app.id} className="p-4 hover:bg-muted/20 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Scissors className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tighter">{app.service?.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {format(new Date(app.starts_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <p className="text-xs font-bold text-primary">R$ {app.service?.price || 0}</p>
                        <Badge variant="outline" className="text-[8px] uppercase font-black">
                          {app.status === 'confirmed' ? 'Confirmado' : 
                           app.status === 'pending' ? 'Pendente' :
                           app.status === 'completed' ? 'Concluído' : 'Cancelado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-muted-foreground italic text-sm">Nenhum agendamento registrado.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
