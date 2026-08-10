import { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");

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

  const isRead = (notification: any) => !!notification.read_at;

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'confirmed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const markAsRead = async (id: string) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: now })
      .eq("id", id);
    
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: now } : n));
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "unread" ? !isRead(n) :
      isRead(n);
    
    const matchesSearch = 
      n.title?.toLowerCase().includes(search.toLowerCase()) || 
      n.body?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Notificações" 
        description="Controle e histórico de solicitações dos clientes."
      />

      <div className="grid gap-6 lg:grid-cols-1">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/40 p-4 rounded-2xl border border-border/60">
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl w-full sm:w-auto">
              <Button 
                variant={filter === "all" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setFilter("all")}
                className="rounded-lg text-xs uppercase font-bold h-8"
              >
                Todas
              </Button>
              <Button 
                variant={filter === "unread" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setFilter("unread")}
                className="rounded-lg text-xs uppercase font-bold h-8"
              >
                Não Lidas
              </Button>
              <Button 
                variant={filter === "read" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setFilter("read")}
                className="rounded-lg text-xs uppercase font-bold h-8"
              >
                Lidas
              </Button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border-border/60 bg-background/50 h-10 text-xs pl-9"
              />
            </div>
          </div>

          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4">
              <CardTitle className="text-lg font-heading">Histórico</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 h-20 animate-pulse bg-muted/10" />
                  ))
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => !isRead(n) && markAsRead(n.id)}
                      className={cn(
                        "p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors group cursor-pointer",
                        !isRead(n) && "bg-primary/5"
                      )}
                    >
                      <div className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className={cn("text-sm", !isRead(n) ? "font-black" : "font-medium")}>{n.title}</p>
                            {!isRead(n) && <Badge className="h-2 w-2 rounded-full p-0 bg-primary" />}
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                             <Clock className="h-3 w-3" /> {format(new Date(n.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                           </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-background/50">
                            {n.type}
                          </Badge>
                          {isRead(n) && (
                            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Lida em {format(new Date(n.read_at), "dd/MM HH:mm")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground italic">Nenhuma notificação encontrada.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { AlertCircle } from "lucide-react";
