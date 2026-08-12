import { useState, useEffect } from "react";
import { 
  Scissors, 
  Plus, 
  Clock, 
  Trash2, 
  Edit,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: ""
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("name", { ascending: true });
    
    if (data) setServices(data);
    setLoading(false);
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.duration_minutes) {
      toast({ title: "Erro", description: "Preencha os campos obrigatórios.", variant: "destructive" });
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration_minutes: parseInt(formData.duration_minutes),
      is_active: true
    };

    if (editingService) {
      await supabase.from("services").update(payload).eq("id", editingService.id);
    } else {
      await supabase.from("services").insert(payload);
    }

    setIsOpen(false);
    setEditingService(null);
    setFormData({ name: "", description: "", price: "", duration_minutes: "" });
    fetchServices();
    toast({ title: "Sucesso", description: "Serviço salvo!" });
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase.from("services").update({ is_active: !currentStatus }).eq("id", id);
    fetchServices();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Serviços" description="Gerencie o catálogo de serviços." />
        <Button 
          onClick={() => { setEditingService(null); setIsOpen(true); }}
          className="rounded-xl shadow-lg shadow-primary/20 h-10 px-6 font-bold uppercase text-xs"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Serviço
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-muted/20 animate-pulse rounded-2xl" />)
        ) : services.map((s) => (
          <Card key={s.id} className="rounded-2xl border-none bg-white shadow-sm hover:shadow-md transition-all p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg uppercase tracking-tighter">{s.name}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingService(s); setFormData({ name: s.name, description: s.description || "", price: s.price.toString(), duration_minutes: s.duration_minutes.toString() }); setIsOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className={cn("h-8 w-8", s.is_active ? "text-green-500" : "text-red-500")} onClick={() => toggleActive(s.id, s.is_active)}>
                  {s.is_active ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{s.description}</p>
            <div className="flex justify-between pt-2">
              <Badge variant="outline">{s.duration_minutes} min</Badge>
              <div className="font-black text-primary">R$ {s.price}</div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? "Editar" : "Novo"} Serviço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Duração (min)</Label>
                <Input type="number" value={formData.duration_minutes} onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} className="w-full">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
