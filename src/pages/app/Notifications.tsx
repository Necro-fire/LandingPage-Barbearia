import { useState, useEffect } from "react";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  Settings,
  AlertCircle,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setNotifications(data);
      setLoading(false);
    }
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'appointment_cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'reminder': return <Clock className="h-5 w-5 text-amber-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Central de Notificações" 
          description="Gerencie alertas do sistema, e-mails e mensagens de WhatsApp."
        />
        <Button variant="outline" className="rounded-xl border-border/60">
          <Settings className="h-4 w-4 mr-2" /> Configurações de Envio
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40">
              <CardTitle className="text-lg font-heading">Histórico Recente</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 h-20 animate-pulse bg-muted/10" />
                  ))
                ) : notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors group">
                      <div className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold">{n.title}</p>
                          <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                             <Clock className="h-3 w-3" /> {format(new Date(n.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                           </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground italic">Nenhuma notificação encontrada.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Canais de Envio</CardTitle>
              <CardDescription>Defina por onde os clientes recebem avisos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Sistema</p>
                    <p className="text-[10px] text-muted-foreground">App e Painel</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">E-mail</p>
                    <p className="text-[10px] text-muted-foreground">Alertas por correio</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">WhatsApp</p>
                    <p className="text-[10px] text-muted-foreground">Mensagens diretas</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-primary" /> Dica de Automação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Lembretes enviados 2h antes do atendimento via WhatsApp reduzem faltas em até 40%.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
