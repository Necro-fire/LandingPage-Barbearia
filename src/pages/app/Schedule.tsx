import { useState, useEffect } from "react";
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Filter, 
  Plus,
  User,
  Scissors,
  MoreVertical,
  Calendar as CalendarIcon
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type ViewType = "day" | "week" | "month";

export default function Schedule() {
  const [view, setView] = useState<ViewType>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [appRes, brbRes] = await Promise.all([
        supabase
          .from("appointments")
          .select(`
            *,
            service:service_id(name, duration_minutes, price),
            barber:barber_id(display_name),
            client:client_id(full_name)
          `)
          .order("starts_at", { ascending: true }),
        supabase.from("barbers").select("*").eq("is_active", true)
      ]);

      if (appRes.data) setAppointments(appRes.data);
      if (brbRes.data) setBarbers(brbRes.data);
      setLoading(false);
    }
    fetchData();
  }, [currentDate]);

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === "day") newDate.setDate(newDate.getDate() + direction);
    if (view === "week") newDate.setDate(newDate.getDate() + direction * 7);
    if (view === "month") newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 08:00 to 21:00

    return (
      <div className="space-y-4">
        {hours.map((hour) => {
          const timeStr = `${hour.toString().padStart(2, "0")}:00`;
          const hourAppointments = appointments.filter(app => {
            const appDate = new Date(app.starts_at);
            return isSameDay(appDate, currentDate) && appDate.getHours() === hour;
          });

          return (
            <div key={hour} className="group flex gap-4 min-h-[80px]">
              <div className="w-16 pt-2 text-sm text-muted-foreground font-medium">
                {timeStr}
              </div>
              <div className="flex-1 border-t border-border/40 group-last:border-b py-2 relative">
                {hourAppointments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {hourAppointments.map((app) => (
                      <Card 
                        key={app.id} 
                        className={cn(
                          "border-l-4 rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer",
                          app.status === "confirmed" ? "border-l-green-500 bg-green-500/5" :
                          app.status === "pending" ? "border-l-amber-500 bg-amber-500/5" :
                          "border-l-blue-500 bg-blue-500/5"
                        )}
                      >
                        <CardContent className="p-3 flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <p className="font-bold text-sm leading-tight">{app.client?.full_name || "Cliente"}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Scissors className="h-3 w-3" /> {app.service?.name} • {app.barber?.display_name}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-[10px] h-5 px-1 bg-background/50 backdrop-blur-sm">
                            {format(new Date(app.starts_at), "HH:mm")}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center text-xs text-muted-foreground/30 italic opacity-0 group-hover:opacity-100 transition-opacity">
                    Horário disponível
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end: endOfWeek(currentDate) });

    return (
      <div className="grid grid-cols-7 gap-2 overflow-x-auto min-w-[700px]">
        {days.map((day) => {
          const dayAppointments = appointments.filter(app => isSameDay(new Date(app.starts_at), day));
          const isToday = isSameDay(day, new Date());

          return (
            <div key={day.toString()} className="space-y-3 min-w-[100px]">
              <div className={cn(
                "text-center py-2 rounded-xl transition-colors",
                isToday ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary/50 text-muted-foreground"
              )}>
                <p className="text-[10px] uppercase font-bold tracking-wider">{format(day, "eee", { locale: ptBR })}</p>
                <p className="text-lg font-heading font-black">{format(day, "dd")}</p>
              </div>
              <div className="space-y-2">
                {dayAppointments.map(app => (
                  <div 
                    key={app.id} 
                    className="p-2 rounded-lg bg-card border border-border/60 text-[10px] shadow-sm hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="font-bold truncate">{app.client?.full_name?.split(" ")[0]}</div>
                    <div className="text-muted-foreground truncate">{format(new Date(app.starts_at), "HH:mm")}</div>
                  </div>
                ))}
                {dayAppointments.length === 0 && (
                  <div className="h-20 rounded-lg border border-dashed border-border/40 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Agenda Inteligente" 
          description="Gerencie horários, bloqueios e disponibilidade."
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-border/60">
            <Filter className="h-4 w-4 mr-2" /> Filtros
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> Bloquear Horário
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-secondary/50 rounded-xl p-1">
                <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)} className="h-8 w-8 rounded-lg hover:bg-background">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="px-3 h-8 rounded-lg hover:bg-background text-xs font-bold uppercase tracking-wider">
                  Hoje
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigateDate(1)} className="h-8 w-8 rounded-lg hover:bg-background">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-heading font-bold text-lg capitalize">
                {format(currentDate, view === "month" ? "MMMM yyyy" : "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </h3>
            </div>

            <Tabs value={view} onValueChange={(v) => setView(v as ViewType)} className="w-full sm:w-auto">
              <TabsList className="bg-secondary/50 rounded-xl p-1">
                <TabsTrigger value="day" className="rounded-lg text-xs uppercase font-bold">Dia</TabsTrigger>
                <TabsTrigger value="week" className="rounded-lg text-xs uppercase font-bold">Semana</TabsTrigger>
                <TabsTrigger value="month" className="rounded-lg text-xs uppercase font-bold">Mês</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground italic">
                Sincronizando agenda...
              </div>
            ) : (
              <>
                {view === "day" && renderDayView()}
                {view === "week" && renderWeekView()}
                {view === "month" && (
                  <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="font-bold">Calendário Mensal</p>
                      <p className="text-sm">Clique em um dia para ver os detalhes da agenda.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl" onClick={() => setView("day")}>
                      Voltar para visão diária
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* List view / Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Total de Horas</p>
              <p className="text-lg font-heading font-black">42h</p>
            </div>
          </Card>
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Taxa de Ocupação</p>
              <p className="text-lg font-heading font-black">78%</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
