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
  Calendar as CalendarIcon,
  Phone,
  Info
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type ViewType = "day" | "week" | "month";

export default function Schedule() {
  const [view, setView] = useState<ViewType>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [filterBarber, setFilterBarber] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

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

  const filteredAppointments = appointments.filter(app => {
    const matchesBarber = filterBarber === "all" || app.barber_id === filterBarber;
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesBarber && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "border-l-amber-500 bg-amber-500/5";
      case "confirmed": return "border-l-green-500 bg-green-500/5";
      case "completed": return "border-l-blue-500 bg-blue-500/5";
      case "cancelled": return "border-l-red-500 bg-red-500/5";
      default: return "border-l-muted bg-muted/5";
    }
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 08:00 to 21:00

    return (
      <div className="space-y-4">
        {hours.map((hour) => {
          const timeStr = `${hour.toString().padStart(2, "0")}:00`;
          const hourAppointments = filteredAppointments.filter(app => {
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
                          getStatusColor(app.status)
                        )}
                        onClick={() => setSelectedAppointment(app)}
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
          const dayAppointments = filteredAppointments.filter(app => isSameDay(new Date(app.starts_at), day));
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
                    className={cn("p-2 rounded-lg bg-card border border-border/60 text-[10px] shadow-sm hover:border-primary/50 transition-all cursor-pointer", getStatusColor(app.status))}
                    onClick={() => setSelectedAppointment(app)}
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
          title="Agenda" 
          description="Acompanhe os horários e atendimentos da sua barbearia."
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl border-border/60">
                <Filter className="h-4 w-4 mr-2" /> Profissional: {filterBarber === "all" ? "Todos" : barbers.find(b => b.id === filterBarber)?.display_name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              <DropdownMenuItem onClick={() => setFilterBarber("all")}>Todos</DropdownMenuItem>
              {barbers.map(b => (
                <DropdownMenuItem key={b.id} onClick={() => setFilterBarber(b.id)}>{b.display_name}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl border-border/60">
                <Filter className="h-4 w-4 mr-2" /> Status: {filterStatus === "all" ? "Todos" : 
                  filterStatus === "pending" ? "Pendente" :
                  filterStatus === "confirmed" ? "Confirmado" :
                  filterStatus === "completed" ? "Concluído" : "Cancelado"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pendente</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("confirmed")}>Confirmado</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Concluído</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>Cancelado</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> Novo Agendamento
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

      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="rounded-2xl border-border/60 bg-card/95 backdrop-blur-xl sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl uppercase tracking-tighter">Detalhes do Agendamento</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-widest text-muted-foreground">
              Informações completas da reserva
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Cliente</p>
                  <p className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter"><User className="h-3 w-3 text-primary" /> {selectedAppointment.client?.full_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Status</p>
                  <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-tighter", 
                    selectedAppointment.status === 'pending' ? 'border-amber-500 text-amber-500' :
                    selectedAppointment.status === 'confirmed' ? 'border-green-500 text-green-500' :
                    selectedAppointment.status === 'completed' ? 'border-blue-500 text-blue-500' :
                    'border-red-500 text-red-500'
                  )}>
                    {selectedAppointment.status === 'pending' ? 'PENDENTE' :
                     selectedAppointment.status === 'confirmed' ? 'CONFIRMADO' :
                     selectedAppointment.status === 'completed' ? 'CONCLUÍDO' : 'CANCELADO'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Serviço</p>
                  <p className="text-sm font-bold flex items-center gap-2"><Scissors className="h-3 w-3 text-primary" /> {selectedAppointment.service?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Valor</p>
                  <p className="text-sm font-bold text-primary">R$ {selectedAppointment.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Profissional</p>
                  <p className="text-sm font-bold uppercase tracking-tighter">{selectedAppointment.barber?.display_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Duração</p>
                  <p className="text-sm font-bold">{selectedAppointment.service?.duration_minutes} min</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/40">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-medium">
                     <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                     {format(new Date(selectedAppointment.starts_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                   </div>
                   <div className="flex items-center gap-2 text-xs font-medium">
                     <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                     {format(new Date(selectedAppointment.starts_at), "HH:mm")} - {format(new Date(selectedAppointment.ends_at), "HH:mm")}
                   </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedAppointment.status === 'pending' && (
                  <Button className="flex-1 rounded-xl bg-green-600 hover:bg-green-700">Aprovar</Button>
                )}
                <Button variant="outline" className="flex-1 rounded-xl border-border/60 text-red-500 hover:bg-red-500/10">Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
