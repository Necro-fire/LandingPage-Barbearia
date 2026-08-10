import { useState, useEffect } from "react";
import { 
  Scissors, 
  Plus, 
  Clock, 
  DollarSign, 
  MoreVertical, 
  Settings2,
  Image as ImageIcon
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      const { data } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });
      
      if (data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Serviços" 
          description="Lista de serviços oferecidos pela barbearia."
        />
        <Button className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" /> Novo Serviço
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 w-full bg-muted/20 animate-pulse rounded-2xl" />
          ))
        ) : services.map((service) => (
          <Card key={service.id} className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden group">
            <div className="h-32 bg-secondary/50 relative overflow-hidden">
              {service.image_url ? (
                <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Scissors className="h-8 w-8 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-background/80 backdrop-blur">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem className="rounded-lg"><Settings2 className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg text-red-500">Desativar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">{service.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description || "Sem descrição disponível."}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="rounded-lg bg-secondary/50 border-none flex items-center gap-1 px-2">
                    <Clock className="h-3 w-3" /> {service.duration_minutes} min
                  </Badge>
                </div>
                <div className="text-lg font-heading font-black text-primary">
                  R$ {service.price}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
