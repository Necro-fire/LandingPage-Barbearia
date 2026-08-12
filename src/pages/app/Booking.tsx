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

type Step = "service" | "barber" | "date" | "time" | "guest-info" | "summary" | "confirmation";

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
  const [shopWorkingHours, setShopWorkingHours] = useState<any[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const [srvRes, brbRes, shopRes] = await Promise.all([
        supabase.from("services").select("*").eq("is_active", true),
        supabase.from("barbers").select("*").eq("is_active", true),
        (supabase as any).from("shop_working_hours").select("*")
      ]);
      if (srvRes.data) setServices(srvRes.data);
      if (brbRes.data) setBarbers(brbRes.data);
      if (shopRes.data) setShopWorkingHours(shopRes.data);
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
    const weekday = selectedDate.getDay();

    const [appointmentsRes, shopHoursRes, exceptionsRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("starts_at, ends_at")
        .eq("barber_id", selectedBarber.id)
        .gte("starts_at", startOfSelectedDay.toISOString())
        .lte("starts_at", endOfSelectedDay.toISOString())
        .neq("status", "cancelled"),
      (supabase as any).from("shop_working_hours").select("*").eq("weekday", weekday).maybeSingle(),
      supabase.from("schedule_exceptions").select("*").eq("date", format(selectedDate, "yyyy-MM-dd")).maybeSingle()
    ]);

    const existingApps = appointmentsRes.data;
    const shopConfig = shopHoursRes.data;
    const exception = exceptionsRes.data;

    const slots: string[] = [];
    const serviceDuration = selectedService.duration_minutes;

    // Determine working intervals for this day
    let workingIntervals: { start: string, end: string }[] = [];

    if (exception) {
      if (!exception.is_closed && exception.start_time && exception.end_time) {
        workingIntervals = [{ start: exception.start_time, end: exception.end_time }];
      }
    } else if (shopConfig && shopConfig.active) {
      workingIntervals = shopConfig.intervals || [];
    }

    workingIntervals.forEach(interval => {
      const [startH, startM] = interval.start.split(":").map(Number);
      const [endH, endM] = interval.end.split(":").map(Number);

      let current = new Date(startOfSelectedDay);
      current.setHours(startH, startM, 0, 0);
      
      const endDay = new Date(startOfSelectedDay);
      endDay.setHours(endH, endM, 0, 0);

      while (current < endDay) {
        const slotStart = new Date(current);
        const slotEnd = new Date(current.getTime() + serviceDuration * 60000);
        
        // Ensure slot doesn't end after working hours
        if (slotEnd > endDay) break;

        const isOccupied = existingApps?.some(app => {
          const appStart = new Date(app.starts_at);
          const appEnd = new Date(app.ends_at);
          return (slotStart < appEnd && slotEnd > appStart);
        });

        const isPast = isBefore(slotStart, new Date());

        if (!isOccupied && !isPast) {
          slots.push(format(slotStart, "HH:mm"));
        }
        
        current.setMinutes(current.getMinutes() + 15); // Check every 15 mins for more flexibility
      }
    });

    setAvailableTimes([...new Set(slots)].sort()); // Ensure unique and sorted
    setLoadingTimes(false);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    
    if (!user && (!guestName || !guestPhone)) {
      setStep("guest-info");
      return;
    }

    setLoading(true);

    const startDateTime = new Date(selectedDate);
    const [hours, mins] = selectedTime.split(":").map(Number);
    startDateTime.setHours(hours, mins, 0, 0);
    
    const endDate = new Date(startDateTime.getTime() + selectedService.duration_minutes * 60000);

    // 1. Ensure client exists (if not logged in)
    let clientId = user?.id;
    
    if (!clientId) {
      // Look for profile with same phone
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", guestPhone)
        .maybeSingle();
      
      if (existingProfile) {
        clientId = existingProfile.id;
      } else {
        // Since we can't create auth users directly without their interaction (usually),
        // we'll store the guest info in the appointment itself as per our updated schema.
        // The admin can manually create a profile later or we can have a trigger.
      }
    }

    const { error } = await supabase.from("appointments").insert({
      client_id: clientId || null,
      guest_name: clientId ? null : guestName,
      guest_phone: clientId ? null : guestPhone,
      service_id: selectedService.id,
      barber_id: selectedBarber.id,
      starts_at: startDateTime.toISOString(),
      ends_at: endDate.toISOString(),
      status: "pending",
      price: selectedService.price
    });

    // Create a notification for the admin
    if (!error) {
      await supabase.from("notifications").insert({
        user_id: "00000000-0000-0000-0000-000000000000", // We should ideally find an admin ID, but for now we target the first admin or a placeholder
        title: "Novo Agendamento Solicitado",
        body: `${user?.full_name || guestName} solicitou ${selectedService.name} para ${format(startDateTime, "dd/MM 'às' HH:mm")}`,
        type: "appointment"
      });
    }

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
          <div className="space-y-0" id="booking-section">
            <div className="mb-20 text-center">
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 uppercase mb-4">Nossos Preços</h3>
              <p className="text-[10px] md:text-[11px] tracking-[0.3em] text-slate-400 uppercase">Obtenha uma gama completa de serviços premium.</p>
            </div>
            <div className="grid gap-x-20 gap-y-0 lg:grid-cols-2">
              {services.map((s) => (
                <div 
                  key={s.id} 
                  className={cn(
                    "group cursor-pointer border-b border-slate-100 py-10 transition-all hover:bg-slate-50",
                    selectedService?.id === s.id && "bg-slate-100/50"
                  )}
                  onClick={() => {
                    setSelectedService(s);
                    setStep("barber");
                  }}
                >
                  <div className="flex justify-between items-baseline mb-3">
                    <h4 className="text-base font-bold uppercase tracking-widest text-slate-900 group-hover:text-primary transition-colors">
                      {s.name}
                    </h4>
                    <span className="text-base font-bold text-primary tracking-widest">
                      ${s.price}+
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 tracking-wider leading-relaxed pr-10">
                    {s.description || "Um ótimo corte de cabelo é o melhor acessório que um homem pode ter."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "barber":
        return (
          <div className="grid gap-8 sm:grid-cols-2">
            {barbers.map((b) => (
              <div 
                key={b.id} 
                className={cn(
                  "group cursor-pointer transition-all border border-slate-100 bg-white p-8 rounded-2xl shadow-sm hover:border-primary/50",
                  selectedBarber?.id === b.id && "border-primary bg-primary/5 shadow-md shadow-primary/5"
                )}
                onClick={() => {
                  setSelectedBarber(b);
                  setStep("date");
                }}
              >
                <div className="flex gap-6 items-center">
                  <div className="h-24 w-24 overflow-hidden border border-slate-100 rounded-xl grayscale group-hover:grayscale-0 transition-all">
                    {b.avatar_url ? (
                      <img src={b.avatar_url} alt={b.display_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-slate-50 flex items-center justify-center">
                        <User className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-2">{b.display_name}</h4>
                    <p className="text-[10px] text-slate-400 tracking-wider uppercase leading-relaxed">
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
        const firstDayOfWeek = start.getDay();
        const blanks = Array.from({ length: firstDayOfWeek });

        return (
          <div className="max-w-md mx-auto space-y-12">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-slate-400 hover:text-slate-900"><ChevronLeft className="h-6 w-6" /></button>
              <h3 className="text-base font-bold uppercase tracking-widest text-slate-900">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</h3>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-slate-400 hover:text-slate-900"><ChevronRight className="h-6 w-6" /></button>
            </div>

            <div className="grid grid-cols-7 gap-3 text-center">
              {["D", "S", "T", "Q", "Q", "S", "S"].map(d => (
                <div key={d} className="text-[10px] font-bold text-slate-300 py-3">{d}</div>
              ))}
              {blanks.map((_, i) => <div key={`blank-${i}`} />)}
              {days.map((day) => {
                const isPast = isBefore(day, startOfDay(new Date()));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const shopConfig = shopWorkingHours.find(s => s.weekday === day.getDay());
                const isClosedByConfig = shopConfig ? !shopConfig.active : false;

                return (
                  <button
                    key={day.toString()}
                    disabled={isPast || isSunday}
                    onClick={() => {
                      setSelectedDate(day);
                      setStep("time");
                    }}
                    className={cn(
                      "aspect-square text-[11px] font-bold tracking-tighter flex items-center justify-center transition-all border border-transparent rounded-lg",
                      isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-slate-600 hover:border-slate-200 hover:bg-slate-50",
                      (isPast || isSunday) && "opacity-20 cursor-not-allowed"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case "time":
        return (
          <div className="space-y-10">
            {isSlotTaken && (
              <div className="p-6 bg-red-500/10 border border-red-500/50 flex items-center gap-4 text-red-500 rounded-none">
                <AlertCircle className="h-6 w-6 shrink-0" />
                <p className="text-[11px] font-black uppercase tracking-widest">O horário que você escolheu acaba de ser ocupado. Por favor, selecione outro.</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
              {loadingTimes ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-16 border border-slate-100 bg-slate-50 animate-pulse rounded-xl" />
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
                      "border border-slate-100 bg-white py-6 text-[11px] font-bold tracking-widest text-slate-900 transition-all rounded-xl shadow-sm hover:border-primary hover:text-primary hover:shadow-md",
                      selectedTime === t && "border-primary text-white bg-primary shadow-lg shadow-primary/30"
                    )}
                  >
                    {t}
                  </button>
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">NÃO HÁ HORÁRIOS DISPONÍVEIS NESTA DATA.</p>
                </div>
              )}
            </div>
          </div>
        );
      case "guest-info":
        return (
          <div className="max-w-md mx-auto border border-slate-100 bg-white p-10 space-y-10 rounded-3xl shadow-sm">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">NOME COMPLETO</label>
                <Input 
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)}
                  className="rounded-xl bg-slate-50 border-slate-100 text-slate-900 text-sm focus:border-primary h-14"
                  placeholder="DIGITE SEU NOME"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">WHATSAPP / TELEFONE</label>
                <Input 
                  value={guestPhone} 
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="rounded-xl bg-slate-50 border-slate-100 text-slate-900 text-sm focus:border-primary h-14"
                  placeholder="(99) 9 9999-9999"
                />
              </div>
            </div>
            <Button 
              onClick={() => {
                if (!guestName || !guestPhone) {
                  toast({ title: "Campos obrigatórios", description: "Por favor, preencha seu nome e telefone.", variant: "destructive" });
                  return;
                }
                setStep("summary");
              }}
              className="w-full rounded-xl bg-primary py-10 text-[12px] font-bold tracking-widest uppercase text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >
              PRÓXIMO PASSO
            </Button>
          </div>
        );
      case "summary":
        return (
          <div className="max-w-md mx-auto border border-slate-100 bg-white p-10 space-y-12 rounded-3xl shadow-sm">
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b border-slate-50 pb-5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">SERVIÇO</span>
                <span className="text-[11px] font-bold tracking-tight text-slate-900 uppercase">{selectedService.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">BARBEIRO</span>
                <span className="text-[11px] font-bold tracking-tight text-slate-900 uppercase">{selectedBarber.display_name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">DATA E HORA</span>
                <span className="text-[11px] font-bold tracking-tight text-slate-900 uppercase">{selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""} - {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-[10px] font-bold tracking-wider text-slate-900 uppercase">TOTAL</span>
                <span className="text-2xl font-bold tracking-tight text-primary">R$ {selectedService.price}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleBooking} 
              disabled={loading} 
              className="w-full rounded-xl bg-primary py-10 text-[12px] font-bold tracking-widest uppercase text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >
              {loading ? <Spinner className="h-6 w-6" /> : "CONFIRMAR AGENDAMENTO"}
            </Button>
          </div>
        );
      case "confirmation":
        return (
          <div className="text-center space-y-10 py-16">
            <div className="mx-auto flex h-28 w-28 items-center justify-center border-2 border-primary text-primary">
              <Check className="h-12 w-12" />
            </div>
            <div className="space-y-6">
              <h3 className="text-4xl font-black uppercase tracking-tighter text-white">SOLICITAÇÃO ENVIADA</h3>
              <p className="text-[11px] leading-relaxed tracking-wider text-white/40 max-w-sm mx-auto uppercase">
                SEU AGENDAMENTO ESTÁ AGUARDANDO APROVAÇÃO. VOCÊ RECEBERÁ UMA CONFIRMAÇÃO EM BREVE.
              </p>
            </div>
            <button 
              onClick={() => setStep("service")} 
              className="text-[11px] font-black tracking-[0.3em] text-white underline decoration-primary decoration-2 underline-offset-8"
            >
              NOVO AGENDAMENTO
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary/30">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black px-4 md:px-6 py-4 md:py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-black tracking-tighter text-white uppercase">ON-TESTE</span>
          </div>
          <div className="hidden items-center gap-10 lg:flex">
            <a href="#" className="text-[10px] font-black tracking-[0.2em] text-white/70 hover:text-primary transition-colors uppercase">INÍCIO</a>
            <a href="#" className="text-[10px] font-black tracking-[0.2em] text-white/70 hover:text-primary transition-colors uppercase">SERVIÇOS</a>
            <a href="#" className="text-[10px] font-black tracking-[0.2em] text-white/70 hover:text-primary transition-colors uppercase">SOBRE</a>
            <a href="#" className="text-[10px] font-black tracking-[0.2em] text-white/70 hover:text-primary transition-colors uppercase">CONTATO</a>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              onClick={() => {
                const el = document.getElementById('booking-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-none bg-primary px-4 md:px-8 py-5 md:py-6 text-[9px] md:text-[10px] font-black tracking-[0.2em] text-black hover:bg-primary/90 transition-all uppercase whitespace-nowrap"
            >
              AGENDAR HORÁRIO
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
            className="h-full w-full object-cover opacity-10 grayscale brightness-125" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto max-w-4xl px-6 text-center">
          <span className="mb-4 block text-[9px] font-black tracking-[0.5em] text-primary uppercase animate-fade-in">BEM-VINDO À ON-TESTE</span>
          <h1 className="mb-6 font-heading text-5xl font-bold uppercase tracking-tight text-slate-900 md:text-8xl lg:text-9xl leading-[0.9]">
            ESTILO & <br />
            <span className="text-primary italic">CONFIANÇA</span>
          </h1>
          <p className="mb-10 text-[10px] md:text-[11px] leading-relaxed tracking-[0.2em] text-slate-400 uppercase max-w-xl mx-auto font-medium">
            A BARBEARIA QUE UNE O CLÁSSICO AO MODERNO. <br className="hidden md:block" />
            OBTENHA UMA GAMA COMPLETA DE SERVIÇOS PREMIUM.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg"
              onClick={() => {
                const el = document.getElementById('booking-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl bg-primary px-12 py-8 text-[11px] font-bold tracking-[0.2em] text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all uppercase"
            >
              AGENDAR HORÁRIO
            </Button>
            <button className="text-[10px] font-bold tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors border-b border-slate-200 pb-1 uppercase">
              CONHEÇA NOSSO ESPAÇO
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="space-y-20 md:space-y-32">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-8 mb-12 md:mb-16 gap-6">
              <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-900 md:text-5xl leading-tight">
                OFERECEMOS SERVIÇOS DE <br className="hidden md:block" /> 
                <span className="text-primary text-xl md:text-2xl tracking-[0.2em] font-bold">PRIMEIRA CLASSE</span>
              </h2>
              {step !== "service" && step !== "confirmation" && (
                <button 
                  onClick={() => {
                    if (step === "barber") setStep("service");
                    if (step === "date") setStep("barber");
                    if (step === "time") setStep("date");
                    if (step === "guest-info") setStep("time");
                    if (step === "summary") {
                      if (user) setStep("time");
                      else setStep("guest-info");
                    }
                  }}
                  className="flex items-center gap-3 text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-primary transition-colors uppercase"
                >
                  <ArrowLeft className="h-4 w-4" /> VOLTAR
                </button>
              )}
            </div>

            <div className="min-h-[600px]">
              {renderStep()}
            </div>
          </div>

          {/* Section Style Image - White Box */}
          <div className="bg-white p-10 md:p-20 text-center max-w-4xl mx-auto rounded-3xl shadow-sm border border-slate-100">
            <div className="h-20 w-20 mx-auto mb-10 overflow-hidden rounded-full shadow-lg">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" className="h-full w-full object-cover" alt="Reviewer" />
            </div>
            <p className="text-[14px] leading-relaxed text-slate-600 tracking-wide max-w-2xl mx-auto italic mb-10">
              "A melhor barbearia que já frequentei. O atendimento é impecável e o ambiente muito profissional. Saio sempre renovado!"
            </p>
            <div className="flex justify-center text-primary mb-2">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <h4 className="text-[12px] font-bold tracking-[0.3em] text-slate-900 uppercase">JONATHAN SMITH</h4>
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-5">
        <a href="https://wa.me/5500000000000" target="_blank" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white shadow-xl shadow-green-500/20 transition-transform hover:scale-110">
          <Phone className="h-6 w-6" />
        </a>
      </div>

      <footer className="border-t border-slate-100 bg-white py-32 px-6">
        <div className="mx-auto max-w-7xl grid gap-20 md:grid-cols-4">
          <div className="space-y-8">
            <span className="font-heading text-2xl font-bold uppercase tracking-tight text-slate-900">ON-TESTE</span>
            <p className="text-[11px] leading-relaxed tracking-wider text-slate-400 uppercase font-medium">
              Excelência em barbearia clássica e moderna. O cuidado que seu visual merece.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold tracking-[0.4em] text-slate-900 uppercase">LINKS RÁPIDOS</h4>
            <ul className="text-[11px] font-bold tracking-[0.3em] text-slate-400 space-y-4 uppercase">
              <li><a href="#" className="hover:text-primary transition-colors">HOME</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">ABOUT US</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">PAGES</a></li>
              <li><a href="/auth" className="hover:text-primary transition-colors">ADMIN</a></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold tracking-[0.4em] text-slate-900 uppercase">CONTATO</h4>
            <ul className="text-[11px] font-bold tracking-[0.3em] text-slate-400 space-y-4 uppercase">
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> (11) 99999-9999</li>
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> AV. PAULISTA, 1000</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold tracking-[0.4em] text-slate-900 uppercase">NEWSLETTER</h4>
            <div className="flex">
              <input type="email" placeholder="SEU E-MAIL" className="bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 text-[11px] w-full focus:outline-none focus:border-primary" />
              <button className="bg-primary text-white px-6 py-4 text-[11px] font-bold rounded-xl ml-2 shadow-lg shadow-primary/20">OK</button>
            </div>
          </div>
        </div>
        <div className="mt-32 text-center text-[10px] font-bold tracking-[0.4em] text-white/20 border-t border-white/5 pt-16 uppercase">
          <p>© {new Date().getFullYear()} BARBER. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  );
}
