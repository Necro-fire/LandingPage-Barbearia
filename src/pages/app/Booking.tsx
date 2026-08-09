import { useState, useEffect } from "react";
import { Check, Calendar, User, Scissors, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/common/Loading";
import { cn } from "@/lib/utils";

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

    const { error } = await supabase.from("appointments").insert({
      client_id: user.id,
      service_id: selectedService.id,
      barber_id: selectedBarber.id,
      start_time: `${selectedDate}T${selectedTime}:00`,
      status: "pending",
      total_price: selectedService.price
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
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <User className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-bold">{b.name}</p>
                    <p className="text-sm text-muted-foreground">{b.specialty || "Barbeiro Especialista"}</p>
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
                className="rounded-xl"
             />
          </div>
        );
      case "time":
        const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
        return (
          <div className="grid grid-cols-4 gap-2">
            {times.map((t) => (
              <Button
                key={t}
                variant={selectedTime === t ? "default" : "outline"}
                onClick={() => {
                  setSelectedTime(t);
                  setStep("summary");
                }}
                className="rounded-lg"
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
                    <p className="font-bold">{selectedBarber.name}</p>
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
              <Button onClick={handleBooking} disabled={loading} className="w-full rounded-xl gap-2">
                {loading ? <Spinner className="h-4 w-4" /> : <>Solicitar Agendamento <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </CardContent>
          </Card>
        );
      case "confirmation":
        return (
          <div className="text-center space-y-6 py-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <Check className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-heading font-bold">Solicitação Enviada!</h3>
              <p className="text-muted-foreground">Seu agendamento está aguardando aprovação da barbearia. Você receberá uma notificação em breve.</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/app"} className="rounded-xl">
              Voltar ao Início
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageHeader 
        title="Novo Agendamento" 
        description={
          step === "service" ? "Selecione o serviço desejado" :
          step === "barber" ? "Escolha seu barbeiro de preferência" :
          step === "date" ? "Qual o melhor dia para você?" :
          step === "time" ? "Escolha um horário disponível" :
          step === "summary" ? "Confira os dados do seu agendamento" :
          "Tudo pronto!"
        }
      />

      {step !== "service" && step !== "confirmation" && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            if (step === "barber") setStep("service");
            if (step === "date") setStep("barber");
            if (step === "time") setStep("date");
            if (step === "summary") setStep("time");
          }}
          className="gap-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      )}

      <div className="mt-4">
        {renderStep()}
      </div>
    </div>
  );
}

// Helper needed
import { Input } from "@/components/ui/input";
