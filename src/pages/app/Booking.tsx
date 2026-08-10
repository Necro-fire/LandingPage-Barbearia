import { useState, useEffect } from "react";
import { Check, Calendar, User, Scissors, Clock, ArrowRight, ArrowLeft, Star, MapPin, Instagram, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/common/Loading";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <Card 
                key={s.id} 
                className={cn(
                  "cursor-pointer transition-all border-border/60 hover:border-primary/50",
                  selectedService?.id === s.id && "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                )}
                onClick={() => {
                  setSelectedService(s);
                  setStep("barber");
                }}
              >
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="font-heading font-bold">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.duration_minutes} min • R$ {s.price}</p>
                  </div>
                  {selectedService?.id === s.id && <Check className="text-primary" />}
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "barber":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            {barbers.map((b) => (
              <Card 
                key={b.id} 
                className={cn(
                  "cursor-pointer transition-all border-border/60 hover:border-primary/50",
                  selectedBarber?.id === b.id && "border-primary bg-primary/5"
                )}
                onClick={() => {
                  setSelectedBarber(b);
                  setStep("date");
                }}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {b.avatar_url ? <img src={b.avatar_url} alt={b.display_name} className="h-full w-full object-cover" /> : <User className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-bold">{b.display_name}</p>
                    <p className="text-sm text-muted-foreground">{b.specialties?.join(", ") || "Barbeiro Especialista"}</p>
                  </div>
                  {selectedBarber?.id === b.id && <Check className="text-primary" />}
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "date":
        return (
          <div className="space-y-4">
             <Input 
                type="date" 
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setStep("time");
                }}
                className="rounded-xl h-12 text-lg"
             />
             <p className="text-sm text-muted-foreground text-center">Clique para selecionar o dia</p>
          </div>
        );
      case "time":
        const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
        return (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {times.map((t) => (
              <Button
                key={t}
                variant={selectedTime === t ? "default" : "outline"}
                onClick={() => {
                  setSelectedTime(t);
                  setStep("summary");
                }}
                className={cn(
                  "rounded-xl h-12 transition-all",
                  selectedTime === t && "shadow-lg shadow-primary/20"
                )}
              >
                {t}
              </Button>
            ))}
          </div>
        );
      case "summary":
        return (
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Scissors className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Serviço</p>
                    <p className="font-bold">{selectedService.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Barbeiro</p>
                    <p className="font-bold">{selectedBarber.display_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Data e Hora</p>
                    <p className="font-bold">{selectedDate} às {selectedTime}</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleBooking} disabled={loading} className="w-full rounded-xl gap-2 shadow-lg shadow-primary/20">
                {loading ? <Spinner className="h-4 w-4" /> : <>Solicitar Agendamento <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </CardContent>
          </Card>
        );
      case "confirmation":
        return (
          <div className="text-center space-y-6 py-10 animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500 ring-8 ring-green-500/5">
              <Check className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-heading font-bold">Solicitação Enviada!</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">Seu agendamento está aguardando aprovação da barbearia. Você receberá uma notificação em breve.</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/app"} className="rounded-xl border-border/60 hover:bg-secondary">
              Voltar ao Início
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navbar Premium */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/60 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-heading text-xl font-bold tracking-tight leading-none">ON-TESTE</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Premium Barbershop</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden rounded-xl md:flex">
              <a href="/auth">Entrar</a>
            </Button>
            <Button size="sm" asChild className="rounded-xl shadow-lg shadow-primary/10">
              <a href="/auth">Administração</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section Simplificado para Agendamento */}
      <section className="relative overflow-hidden border-b border-border/40 bg-muted/20 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(191,155,81,0.15),transparent)]" />
        <div className="container relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Sua melhor versão <br /> 
            <span className="text-primary italic">começa aqui.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Escolha o serviço, seu barbeiro favorito e o horário ideal. 
            Ambiente exclusivo com atendimento premium.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid gap-12 lg:grid-cols-[1fr,350px]">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight font-heading">
                  {step === "service" && "1. Escolha o Corte"}
                  {step === "barber" && "2. Profissional"}
                  {step === "date" && "3. Data"}
                  {step === "time" && "4. Horário"}
                  {step === "summary" && "5. Confirmação"}
                  {step === "confirmation" && "Pronto!"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {step === "service" && "Selecione o estilo que mais combina com você"}
                  {step === "barber" && "Nossos especialistas estão à sua disposição"}
                  {step === "date" && "Selecione o melhor dia na agenda"}
                  {step === "time" && "Horários disponíveis para hoje e próximos dias"}
                  {step === "summary" && "Verifique todos os detalhes antes de finalizar"}
                  {step === "confirmation" && "Seu pedido foi recebido"}
                </p>
              </div>

              {step !== "service" && step !== "confirmation" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (step === "barber") setStep("service");
                    if (step === "date") setStep("barber");
                    if (step === "time") setStep("date");
                    if (step === "summary") setStep("time");
                  }}
                  className="rounded-xl gap-2 border-border/60 hover:bg-secondary"
                >
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </Button>
              )}
            </div>

            <div className="min-h-[400px]">
              {renderStep()}
            </div>
          </div>

          {/* Sidebar de Informações/Reviews */}
          <aside className="space-y-8">
            <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/20">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Localização</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm">Av. Paulista, 1000 - Bela Vista, São Paulo - SP</p>
                </div>
                <Button variant="link" className="p-0 h-auto text-primary text-xs" asChild>
                  <a href="https://maps.google.com" target="_blank">Ver no Google Maps →</a>
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary px-2">Avaliações</h3>
              {[
                { name: "Carlos Silva", text: "Melhor degradê da cidade. O atendimento é nota 10!", stars: 5 },
                { name: "João Pedro", text: "Ambiente muito agradável e profissionais excelentes.", stars: 5 }
              ].map((review, i) => (
                <div key={i} className="space-y-2 p-4 rounded-xl bg-muted/20 border border-border/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{review.name}</span>
                    <div className="flex text-primary">
                      {Array(review.stars).fill(0).map((_, i) => <Star key={i} className="h-3 w-3 fill-primary" />)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">"{review.text}"</p>
                </div>
              ))}
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
    </div>
  );
}
