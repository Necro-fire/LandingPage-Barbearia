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
  Info,
  Trash2,
  Save,
  AlertCircle
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
import { toast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type ViewType = "day" | "week" | "month";

export default function Schedule() {
  const [activeTab, setActiveTab] = useState<"calendar" | "config">("calendar");
  const [view, setView] = useState<ViewType>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [filterBarber, setFilterBarber] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [shopHours, setShopHours] = useState<any>(null);
  const [exceptions, setExceptions] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const [appRes, brbRes, shopRes, exceptionsRes] = await Promise.all([
      supabase
        .from("appointments")
        .select(`
          *,
          service:service_id(name, duration_minutes, price),
          barber:barber_id(display_name),
          client:client_id(full_name)
        `)
        .order("starts_at", { ascending: true }),
      supabase.from("barbers").select("*").eq("is_active", true),
      supabase.from("settings").select("*").eq("is_public", true), // Dummy to avoid TS error for now while we use (supabase as any)
      supabase.from("schedule_exceptions").select("*").order("date", { ascending: true })
    ]);

    // Use (supabase as any) to bypass type checking for the new table
    const { data: realShopData } = await (supabase as any).from("shop_working_hours").select("*").order("weekday", { ascending: true });

    if (appRes.data) setAppointments(appRes.data);
    if (brbRes.data) setBarbers(brbRes.data);
    if (realShopData) {
      const hoursMap: any = {};
      realShopData.forEach((item: any) => {
        hoursMap[item.weekday] = {
          active: item.active,
          hours: item.intervals
        };
      });
      setShopHours(hoursMap);
    }
    if (exceptionsRes.data) setExceptions(exceptionsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const saveWorkingHours = async () => {
    if (!shopHours) return;
    
    setLoading(true);
    const updates = Object.entries(shopHours).map(([weekday, config]: [string, any]) => ({
      weekday: parseInt(weekday),
      active: config.active,
      intervals: config.hours || []
    }));

    const { error } = await (supabase as any).from("shop_working_hours").upsert(updates);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Horários atualizados!" });
    }
    setLoading(false);
  };

  const toggleDayActive = (weekday: number) => {
    setShopHours((prev: any) => ({
      ...prev,
      [weekday]: {
        ...prev[weekday],
        active: !prev[weekday].active,
        hours: prev[weekday].active ? [] : [{ start: "09:00", end: "18:00" }]
      }
    }));
  };

  const addInterval = (weekday: number) => {
    setShopHours((prev: any) => ({
      ...prev,
      [weekday]: {
        ...prev[weekday],
        hours: [...(prev[weekday].hours || []), { start: "09:00", end: "18:00" }]
      }
    }));
  };

  const removeInterval = (weekday: number, index: number) => {
    setShopHours((prev: any) => {
      const newHours = [...prev[weekday].hours];
      newHours.splice(index, 1);
      return {
        ...prev,
        [weekday]: {
          ...prev[weekday],
          hours: newHours
        }
      };
    });
  };

  const updateInterval = (weekday: number, index: number, field: 'start' | 'end', value: string) => {
    setShopHours((prev: any) => {
      const newHours = [...prev[weekday].hours];
      newHours[index] = { ...newHours[index], [field]: value };
      return {
        ...prev,
        [weekday]: {
          ...prev[weekday],
          hours: newHours
        }
      };
    });
  };

  const updateAppointmentStatus = async (id: string, status: any) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status atualizado", description: `Agendamento ${status}.` });
      setSelectedAppointment(null);
      fetchData();
    }
  };

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

  const renderConfigView = () => {
    const weekDays = [
      { id: 1, name: "Segunda" },
      { id: 2, name: "Terça" },
      { id: 3, name: "Quarta" },
      { id: 4, name: "Quinta" },
      { id: 5, name: "Sexta" },
      { id: 6, name: "Sábado" },
      { id: 0, name: "Domingo" },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="grid gap-6">
          <Card className="rounded-2xl border-border/60 bg-card/40 backdrop-blur overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-heading">Horário de Funcionamento</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-widest">Defina o horário padrão de abertura e intervalos.</CardDescription>
                </div>
                <Button size="sm" className="rounded-xl gap-2" onClick={saveWorkingHours}>
                  <Save className="h-4 w-4" /> Salvar Alterações
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {weekDays.map((day) => {
                  const config = shopHours?.[day.id] || { active: false, hours: [] };
                  return (
                    <div key={day.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl border border-border/40 bg-background/50">
                      <div className="flex items-center gap-3 min-w-[120px] pt-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          config.active ? "bg-green-500" : "bg-red-500"
                        )} />
                        <span className="font-bold uppercase tracking-tighter text-sm">{day.name}</span>
                      </div>

                      <div className="flex-1 space-y-3">
                        {config.active ? (
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                              {config.hours?.map((block: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 bg-secondary/80 rounded-lg p-2 group border border-border/40">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <div className="flex items-center gap-1">
                                    <input 
                                      type="time" 
                                      value={block.start} 
                                      onChange={(e) => updateInterval(day.id, idx, 'start', e.target.value)}
                                      className="bg-transparent border-none text-[10px] font-bold w-14 p-0 focus:ring-0"
                                    />
                                    <span className="text-[10px] font-bold text-muted-foreground">/</span>
                                    <input 
                                      type="time" 
                                      value={block.end} 
                                      onChange={(e) => updateInterval(day.id, idx, 'end', e.target.value)}
                                      className="bg-transparent border-none text-[10px] font-bold w-14 p-0 focus:ring-0"
                                    />
                                  </div>
                                  <button 
                                    onClick={() => removeInterval(day.id, idx)}
                                    className="text-muted-foreground hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => addInterval(day.id)}
                              className="h-8 w-fit rounded-lg border border-dashed border-border/60 hover:border-primary/50 text-[9px] font-black uppercase tracking-widest"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Adicionar Turno
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic uppercase tracking-widest pt-1 inline-block">Fechado</span>
                        )}
                      </div>

                      <Button 
                        variant={config.active ? "outline" : "default"}
                        size="sm" 
                        onClick={() => toggleDayActive(day.id)}
                        className="rounded-xl border-border/60 h-8 text-[9px] font-black uppercase tracking-[0.2em] min-w-[100px]"
                      >
                        {config.active ? "Desativar" : "Ativar"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/40 backdrop-blur overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-heading">Exceções de Funcionamento</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-widest">Feriados ou horários especiais.</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl gap-2 border-border/60 text-[9px] font-black uppercase h-8 px-4">
                  <Plus className="h-4 w-4" /> Nova Exceção
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {exceptions.length > 0 ? (
                <div className="space-y-3">
                  {exceptions.map((ex) => (
                    <div key={ex.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-sm uppercase tracking-tighter">{format(new Date(ex.date), "dd 'de' MMMM", { locale: ptBR })}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{ex.reason || "Sem motivo informado"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={cn("rounded-lg uppercase font-black text-[9px] tracking-widest px-3", ex.is_closed ? "border-red-500 text-red-500" : "border-amber-500 text-amber-500")}>
                          {ex.is_closed ? "Fechado" : `${ex.start_time} - ${ex.end_time}`}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => deleteException(ex.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center border border-dashed border-border/40 rounded-xl text-muted-foreground italic text-xs uppercase tracking-widest opacity-40">
                  Nenhuma exceção configurada.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Agenda" 
          description="Controle total de horários, intervalos e exceções."
        />
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
          <TabsList className="bg-secondary/50 rounded-xl p-1 w-full sm:w-auto">
            <TabsTrigger value="calendar" className="rounded-lg text-xs uppercase font-bold flex-1 sm:flex-none">Calendário</TabsTrigger>
            <TabsTrigger value="config" className="rounded-lg text-xs uppercase font-bold flex-1 sm:flex-none">Configurações</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "calendar" ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-xl border-border/60 h-10 text-xs font-bold uppercase tracking-tighter">
                    <Filter className="h-3.5 w-3.5 mr-2" /> Profissional: {filterBarber === "all" ? "Todos" : barbers.find(b => b.id === filterBarber)?.display_name}
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
                  <Button variant="outline" className="rounded-xl border-border/60 h-10 text-xs font-bold uppercase tracking-tighter">
                    <Filter className="h-3.5 w-3.5 mr-2" /> Status: {filterStatus === "all" ? "Todos" : 
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
            </div>
            
            <Button className="rounded-xl shadow-lg shadow-primary/20 h-10 px-6 font-bold uppercase text-xs">
              <Plus className="h-4 w-4 mr-2" /> Novo Agendamento
            </Button>
          </div>

          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-secondary/50 rounded-xl p-1">
                  <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)} className="h-8 w-8 rounded-lg hover:bg-background">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="px-3 h-8 rounded-lg hover:bg-background text-[10px] font-black uppercase tracking-[0.2em]">
                    Hoje
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => navigateDate(1)} className="h-8 w-8 rounded-lg hover:bg-background">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-heading font-black text-xl uppercase tracking-tighter text-primary">
                  {format(currentDate, view === "month" ? "MMMM yyyy" : "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </h3>
              </div>

              <Tabs value={view} onValueChange={(v) => setView(v as ViewType)} className="w-full sm:w-auto">
                <TabsList className="bg-secondary/50 rounded-xl p-1">
                  <TabsTrigger value="day" className="rounded-lg text-[10px] uppercase font-black tracking-widest px-4">Dia</TabsTrigger>
                  <TabsTrigger value="week" className="rounded-lg text-[10px] uppercase font-black tracking-widest px-4">Semana</TabsTrigger>
                  <TabsTrigger value="month" className="rounded-lg text-[10px] uppercase font-black tracking-widest px-4">Mês</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground italic text-sm uppercase tracking-widest animate-pulse">
                  Sincronizando agenda...
                </div>
              ) : (
                <>
                  {view === "day" && renderDayView()}
                  {view === "week" && renderWeekView()}
                  {view === "month" && (
                    <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground text-center space-y-6">
                      <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center ring-8 ring-secondary/20">
                        <CalendarIcon className="h-10 w-10 text-primary/40" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-black uppercase tracking-tighter text-lg">Calendário Mensal</p>
                        <p className="text-xs uppercase tracking-widest max-w-[200px] mx-auto opacity-60">Clique em um dia para ver os detalhes da agenda.</p>
                      </div>
                      <Button variant="outline" className="rounded-xl border-border/60 font-bold uppercase text-[10px]" onClick={() => setView("day")}>
                        Voltar para visão diária
                      </Button>
                    </div>
                  )}
                </>
              )}

            </CardContent>
          </Card>
        </>
      ) : renderConfigView()}



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
                  <p className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter"><Scissors className="h-3 w-3 text-primary" /> {selectedAppointment.service?.name}</p>
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
                  <Button 
                    className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')}
                  >
                    Confirmar
                  </Button>
                )}
                {(selectedAppointment.status === 'confirmed' || selectedAppointment.status === 'pending') && (
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl border-border/60 text-red-500 hover:bg-red-500/10"
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
