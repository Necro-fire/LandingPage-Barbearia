import { useState, useEffect } from "react";
import { Check, Calendar, User, Scissors, Clock, ArrowRight, ArrowLeft, Star, MapPin, Instagram, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/common/Loading";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
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
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

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

  const handleBooking = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const startDateTime = `${selectedDate}T${selectedTime}:00`;
    // Calculate end time based on service duration
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + selectedService.duration_minutes * 60000);

    const { error } = await supabase.from("appointments").insert({
      client_id: user.id,
      service_id: selectedService.id,
      barber_id: selectedBarber.id,
      starts_at: startDate.toISOString(),
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
        return (
          <div className="max-w-md mx-auto space-y-6">
             <div className="p-4 border border-white/5 bg-white/[0.02]">
               <Input 
                  type="date" 
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setStep("time");
                  }}
                  className="rounded-none border-white/10 bg-black text-white text-[10px] font-bold tracking-widest uppercase h-12"
               />
             </div>
             <p className="text-[9px] text-white/30 tracking-[0.2em] text-center uppercase">CLIQUE ACIMA PARA SELECIONAR A DATA</p>
          </div>
        );
      case "time":
        const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
        return (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {times.map((t) => (
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
            ))}
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
                <span className="text-[10px] font-black tracking-[0.1em] text-white uppercase">{selectedDate} - {selectedTime}</span>
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" 
            className="h-full w-full object-cover opacity-40 grayscale" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
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

      <footer className="border-t border-border/40 bg-muted/10 py-12 px-4">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-bold">ON-TESTE</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Excelência em barbearia clássica e moderna. O cuidado que seu visual merece.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest">Horários</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Seg - Sex: 09:00 - 20:00</li>
              <li>Sábado: 09:00 - 18:00</li>
              <li>Domingo: Fechado</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest">Contato</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>(11) 9 9999-9999</li>
              <li>contato@onteste.com.br</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-muted-foreground border-t border-border/20 pt-8">
          <p>© {new Date().getFullYear()} ON-TESTE Barbearia. Todos os direitos reservados.</p>
        </div>
      </footer>
      <div className="fixed bottom-0 left-0 right-0 bg-primary/95 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground backdrop-blur-sm">
        Sistema ON-TESTE: Agendamento • Gestão • Histórico • Notificações • Administrativo
      </div>
    </div>
  );
}
