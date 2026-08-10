import { useState, useEffect } from "react";
import { Check, Calendar, User, Scissors, Clock, ArrowRight, ArrowLeft, Star, MapPin, Instagram, Phone, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/common/Loading";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay, addMonths, subMonths, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import referenceAsset from "@/assets/reference.png.asset.json";

type Step = "service" | "barber" | "date" | "time" | "summary" | "confirmation";

export default function BookingFlow() {
  const [step, setStep] = useState<Step>("service");
  const [loading, setLoading] = useState(false);
  
  // Data from DB
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  
  // Selections
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSlotTaken, setIsSlotTaken] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [srvRes, brbRes] = await Promise.all([
        supabase.from("services").select("*").eq("is_active", true),
        supabase.from("barbers").select("*").eq("is_active", true)
      ]);
      if (srvRes.data) setServices(srvRes.data);
      if (brbRes.data) setBarbers(brbRes.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedBarber && selectedService) {
      fetchAvailableTimes();
    }
  }, [selectedDate, selectedBarber, selectedService]);

  const fetchAvailableTimes = async () => {
    if (!selectedDate || !selectedBarber || !selectedService) return;
    
    setLoadingTimes(true);
    setIsSlotTaken(false);
    
    const startOfSelectedDay = startOfDay(selectedDate);
    const endOfSelectedDay = new Date(startOfSelectedDay);
    endOfSelectedDay.setHours(23, 59, 59, 999);

    const { data: existingApps } = await supabase
      .from("appointments")
      .select("starts_at, ends_at")
      .eq("barber_id", selectedBarber.id)
      .gte("starts_at", startOfSelectedDay.toISOString())
      .lte("starts_at", endOfSelectedDay.toISOString())
      .neq("status", "cancelled");

    const slots: string[] = [];
    let current = new Date(startOfSelectedDay);
    current.setHours(9, 0, 0, 0);
    const endDay = new Date(startOfSelectedDay);
    endDay.setHours(19, 0, 0, 0);

    const serviceDuration = selectedService.duration_minutes;

    while (current < endDay) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + serviceDuration * 60000);
      
      const isOccupied = existingApps?.some(app => {
        const appStart = new Date(app.starts_at);
        const appEnd = new Date(app.ends_at);
        return (slotStart < appEnd && slotEnd > appStart);
      });

      const isPast = isBefore(slotStart, new Date());

      if (!isOccupied && !isPast) {
        slots.push(format(slotStart, "HH:mm"));
      }
      
      current.setMinutes(current.getMinutes() + 30);
    }

    setAvailableTimes(slots);
    setLoadingTimes(false);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const startDateTime = new Date(selectedDate);
    const [hours, mins] = selectedTime.split(":").map(Number);
    startDateTime.setHours(hours, mins, 0, 0);
    
    const endDate = new Date(startDateTime.getTime() + selectedService.duration_minutes * 60000);

    const { data: conflict } = await supabase
      .from("appointments")
      .select("id")
      .eq("barber_id", selectedBarber.id)
      .gte("starts_at", startDateTime.toISOString())
      .lt("starts_at", endDate.toISOString())
      .neq("status", "cancelled")
      .maybeSingle();

    if (conflict) {
      setIsSlotTaken(true);
      setStep("time");
      toast({ title: "Horário Indisponível", description: "Infelizmente esse horário acabou de ser preenchido.", variant: "destructive" });
      setLoading(false);
      fetchAvailableTimes();
      return;
    }

    const { error } = await supabase.from("appointments").insert({
      client_id: user.id,
      service_id: selectedService.id,
      barber_id: selectedBarber.id,
      starts_at: startDateTime.toISOString(),
      ends_at: endDate.toISOString(),
      status: "pending",
      price: selectedService.price
    });

    setLoading(false);
    if (error) {
      toast({ title: "Erro no agendamento", description: error.message, variant: "destructive" });
    } else {
      setStep("confirmation");
    }
  };

  const renderStep = () => {
    switch (step) {
      case "service":
        return (
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((s) => (
              <div 
                key={s.id} 
                className={cn(
                  "group cursor-pointer transition-all border border-white/5 bg-white/[0.02] p-6 hover:border-primary/50",
                  selectedService?.id === s.id && "border-primary bg-white/[0.05]"
                )}
                onClick={() => {
                  setSelectedService(s);
                  setStep("barber");
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-1 w-6 bg-primary group-hover:w-12 transition-all" />
                  <span className="text-[10px] font-bold text-primary tracking-widest">R$ {s.price}</span>
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">{s.name}</h4>
                <p className="text-[10px] text-white/40 tracking-wider mb-4 uppercase">{s.duration_minutes} MINUTOS</p>
                <button className="text-[9px] font-black tracking-[0.2em] text-white underline decoration-primary underline-offset-4">SELECIONAR</button>
              </div>
            ))}
          </div>
        );
      case "barber":
        return (
          <div className="grid gap-6 sm:grid-cols-2">
            {barbers.map((b) => (
              <div 
                key={b.id} 
                className={cn(
                  "group cursor-pointer transition-all border border-white/5 bg-white/[0.02] p-6 hover:border-primary/50",
                  selectedBarber?.id === b.id && "border-primary bg-white/[0.05]"
                )}
                onClick={() => {
                  setSelectedBarber(b);
                  setStep("date");
                }}
              >
                <div className="flex gap-4 items-center">
                  <div className="h-16 w-16 overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all">
                    {b.avatar_url ? (
                      <img src={b.avatar_url} alt={b.display_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-white/5 flex items-center justify-center">
                        <User className="h-6 w-6 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">{b.display_name}</h4>
                    <p className="text-[9px] text-white/40 tracking-wider uppercase leading-relaxed">
                      {b.specialties?.join(" / ") || "ESPECIALISTA EM CORTES"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "date":
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const days = eachDayOfInterval({ start, end });
        
        // Add empty days for the first week
        const firstDayOfWeek = start.getDay();
        const blanks = Array.from({ length: firstDayOfWeek });

        return (
          <div className="max-w-md mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-white/50 hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</h3>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-white/50 hover:text-white"><ChevronRight className="h-5 w-5" /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["D", "S", "T", "Q", "Q", "S", "S"].map(d => (
                <div key={d} className="text-[9px] font-black text-white/30 py-2">{d}</div>
              ))}
              {blanks.map((_, i) => <div key={`blank-${i}`} />)}
              {days.map((day) => {
                const isPast = isBefore(day, startOfDay(new Date()));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isSunday = day.getDay() === 0;

                return (
                  <button
                    key={day.toString()}
                    disabled={isPast || isSunday}
                    onClick={() => {
                      setSelectedDate(day);
                      setStep("time");
                    }}
                    className={cn(
                      "aspect-square text-[10px] font-black tracking-tighter flex items-center justify-center transition-all border border-transparent",
                      isSelected ? "bg-primary text-white" : "text-white/70 hover:border-primary/50 hover:text-white",
                      (isPast || isSunday) && "opacity-10 cursor-not-allowed"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary" />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">SELECIONADO</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 border border-white/20" />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">DISPONÍVEL</span>
              </div>
              <div className="flex items-center gap-2 opacity-30">
                <div className="h-2 w-2 bg-white/10" />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">INDISPONÍVEL</span>
              </div>
            </div>
          </div>
        );
      case "time":
        return (
          <div className="space-y-8">
            {isSlotTaken && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 flex items-center gap-3 text-red-500 rounded-none">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest">O horário que você escolheu acaba de ser ocupado. Por favor, selecione outro.</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
              {loadingTimes ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-12 border border-white/5 bg-white/[0.02] animate-pulse" />
                ))
              ) : availableTimes.length > 0 ? (
                availableTimes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTime(t);
                      setStep("summary");
                    }}
                    className={cn(
                      "border border-white/5 bg-white/[0.02] py-4 text-[10px] font-black tracking-widest text-white transition-all hover:border-primary hover:text-primary",
                      selectedTime === t && "border-primary text-primary bg-white/[0.05]"
                    )}
                  >
                    {t}
                  </button>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">NÃO HÁ HORÁRIOS DISPONÍVEIS NESTA DATA.</p>
                </div>
              )}
            </div>
          </div>
        );
      case "summary":
        return (
          <div className="max-w-md mx-auto border border-white/5 bg-white/[0.02] p-8 space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">SERVIÇO</span>
                <span className="text-[10px] font-black tracking-[0.1em] text-white uppercase">{selectedService.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">BARBEIRO</span>
                <span className="text-[10px] font-black tracking-[0.1em] text-white uppercase">{selectedBarber.display_name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">DATA E HORA</span>
                <span className="text-[10px] font-black tracking-[0.1em] text-white uppercase">{selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""} - {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] font-black tracking-[0.2em] text-white uppercase">TOTAL</span>
                <span className="text-xl font-black tracking-tighter text-primary">R$ {selectedService.price}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleBooking} 
              disabled={loading} 
              className="w-full rounded-none bg-primary py-8 text-[11px] font-black tracking-[0.3em] uppercase text-white hover:bg-primary/90"
            >
              {loading ? <Spinner className="h-4 w-4" /> : "CONFIRMAR AGENDAMENTO"}
            </Button>
          </div>
        );
      case "confirmation":
        return (
          <div className="text-center space-y-8 py-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center border-2 border-primary text-primary">
              <Check className="h-10 w-10" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white">SOLICITAÇÃO ENVIADA</h3>
              <p className="text-[10px] leading-relaxed tracking-wider text-white/40 max-w-sm mx-auto uppercase">
                SEU AGENDAMENTO ESTÁ AGUARDANDO APROVAÇÃO. VOCÊ RECEBERÁ UMA CONFIRMAÇÃO EM BREVE.
              </p>
            </div>
            <button 
              onClick={() => setStep("service")} 
              className="text-[10px] font-black tracking-[0.3em] text-white underline decoration-primary decoration-2 underline-offset-8"
            >
              NOVO AGENDAMENTO
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary/30">
      {/* Navbar Premium */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-black/80 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-heading text-xl font-bold tracking-tighter leading-none text-white">ON-TESTE</span>
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {["INÍCIO", "SERVIÇOS", "BARBEIROS", "CONTATO"].map((item) => (
              <a key={item} href="#" className="text-[10px] font-bold tracking-[0.2em] text-white/70 hover:text-primary transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" asChild className="rounded-none bg-primary px-6 text-[10px] font-bold tracking-widest text-white hover:bg-primary/90">
              <a href="/auth">ADMIN</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section Simplificado para Agendamento */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" 
            className="h-full w-full object-cover opacity-40 grayscale" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
        </div>
        
        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-1 w-12 bg-primary" />
          </div>
          <h1 className="mb-6 font-heading text-5xl font-black uppercase tracking-tighter text-white md:text-7xl lg:text-8xl">
            VAMOS MANTER VOCÊ <br /> 
            <span className="text-white/90">COM UM VISUAL IMPECÁVEL.</span>
          </h1>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <div className="flex items-center gap-2 text-white/60">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold tracking-widest">+55 11 99999-9999</span>
            </div>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-white/10 pt-16">
            <div className="text-left">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-white">BARBEARIA PROFISSIONAL</h3>
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary">APENAS PARA HOMENS</p>
            </div>
            <div className="max-w-[250px] text-left">
              <p className="text-[10px] leading-relaxed text-white/50 tracking-wider">
                O salão oferece cortes "sempre" elegantes de alta qualidade. Nosso foco é manter um visual impecável para o homem moderno.
              </p>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black tracking-[0.2em] text-white">DESDE 2015</p>
              <p className="text-[10px] font-bold text-white/40 tracking-wider">Tradição em cada detalhe</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black tracking-[0.2em] text-white">MAIS DE 1000 CLIENTES</p>
              <p className="text-[10px] font-bold text-white/40 tracking-wider">Satisfação garantida</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-24">
        <div className="grid gap-20 lg:grid-cols-[1fr,400px]">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="h-1 w-12 bg-primary" />
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white md:text-4xl">
                OFERECEMOS SERVIÇOS DA MAIS <br /> 
                <span className="text-primary">ALTA QUALIDADE</span>
              </h2>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                    {step === "service" && "1. Selecione o Corte"}
                    {step === "barber" && "2. Profissional"}
                    {step === "date" && "3. Data"}
                    {step === "time" && "4. Horário"}
                    {step === "summary" && "5. Confirmação"}
                    {step === "confirmation" && "Pronto!"}
                  </h3>
                </div>
                {step !== "service" && step !== "confirmation" && (
                  <button 
                    onClick={() => {
                      if (step === "barber") setStep("service");
                      if (step === "date") setStep("barber");
                      if (step === "time") setStep("date");
                      if (step === "summary") setStep("time");
                    }}
                    className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-white/50 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" /> VOLTAR
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-[500px]">
              {renderStep()}
            </div>
          </div>

          <aside className="space-y-12">
            <div className="space-y-6">
              <div className="h-1 w-12 bg-primary" />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">ESTA ESPERA POR VOCÊ</h3>
              <p className="text-[10px] leading-relaxed tracking-wider text-white/50">
                Reserve seu horário e garanta um atendimento exclusivo em um ambiente preparado para o homem moderno.
              </p>
              
              <div className="space-y-8 pt-8">
                <h4 className="text-[10px] font-black tracking-[0.3em] text-white uppercase underline decoration-primary decoration-2 underline-offset-8">HORÁRIO ESPECIAL DE FUNCIONAMENTO</h4>
                <div className="space-y-4">
                  {[
                    { day: "SEGUNDA-FEIRA", time: "9:00 - 19:00" },
                    { day: "TERÇA-FEIRA", time: "9:00 - 19:00" },
                    { day: "QUARTA-FEIRA", time: "9:00 - 19:00" },
                    { day: "QUINTA-FEIRA", time: "9:00 - 19:00" },
                    { day: "SEXTA-FEIRA", time: "9:00 - 19:00" },
                    { day: "SÁBADO", time: "9:00 - 18:00" },
                    { day: "DOMINGO", time: "FECHADO" },
                  ].map((item) => (
                    <div key={item.day} className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black tracking-[0.2em] text-white">{item.day}</span>
                      <span className="text-[10px] font-bold tracking-[0.1em] text-white/50">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-12">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">AVALIAÇÕES RECENTES</h3>
              <div className="space-y-4">
                {[
                  { name: "CARLOS SILVA", text: "Melhor degradê da cidade. O atendimento é nota 10!", stars: 5 },
                  { name: "JOÃO PEDRO", text: "Ambiente muito agradável e profissionais excelentes.", stars: 5 }
                ].map((review, i) => (
                  <div key={i} className="space-y-2 border-l-2 border-primary/30 pl-4 py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-[0.2em] text-white">{review.name}</span>
                      <div className="flex text-primary">
                        {Array(review.stars).fill(0).map((_, i) => <Star key={i} className="h-2 w-2 fill-primary" />)}
                      </div>
                    </div>
                    <p className="text-[10px] italic leading-relaxed tracking-wider text-white/40">"{review.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      
      {/* Botões Flutuantes Integrados */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <a href="https://wa.me/5500000000000" target="_blank" className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-110">
          <Phone className="h-5 w-5" />
        </a>
        <a href="https://instagram.com" target="_blank" className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white shadow-lg transition-transform hover:scale-110">
          <Instagram className="h-5 w-5" />
        </a>
      </div>

      <footer className="border-t border-white/5 bg-black py-20 px-4">
        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-black uppercase tracking-tighter text-white">ON-TESTE</span>
            </div>
            <p className="text-[10px] leading-relaxed tracking-wider text-white/40 uppercase">
              Excelência em barbearia clássica e moderna. O cuidado que seu visual merece.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">LINKS RÁPIDOS</h4>
            <ul className="text-[10px] font-bold tracking-[0.2em] text-white/50 space-y-3 uppercase">
              <li><a href="#" className="hover:text-primary transition-colors">INÍCIO</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">SERVIÇOS</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">BARBEIROS</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">ADMIN</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">CONTATO</h4>
            <ul className="text-[10px] font-bold tracking-[0.2em] text-white/50 space-y-3 uppercase">
              <li className="flex items-center gap-2"><Phone className="h-3 w-3 text-primary" /> (11) 99999-9999</li>
              <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-primary" /> AV. PAULISTA, 1000</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">NEWSLETTER</h4>
            <div className="flex">
              <input type="email" placeholder="SEU E-MAIL" className="bg-white/5 border border-white/10 rounded-none px-4 py-2 text-[10px] w-full focus:outline-none focus:border-primary" />
              <button className="bg-primary text-white px-4 py-2 text-[10px] font-black">OK</button>
            </div>
          </div>
        </div>
        <div className="mt-20 text-center text-[9px] font-bold tracking-[0.3em] text-white/20 border-t border-white/5 pt-10 uppercase">
          <p>© {new Date().getFullYear()} ON-TESTE BARBEARIA. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  );
}
