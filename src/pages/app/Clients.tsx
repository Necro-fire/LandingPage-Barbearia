import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Calendar,
  Filter,
  ChevronRight,
  UserCheck,
  UserPlus
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    // Fetch profiles and count their appointments
    const { data: profiles } = await supabase
      .from("profiles")
      .select(`
        *,
        appointments:appointments(count)
      `)
      .order("full_name", { ascending: true });
    
    // Also find "guests" who aren't in profiles yet (by unique phone)
    const { data: guests } = await supabase
      .from("appointments")
      .select("guest_name, guest_phone")
      .is("client_id", null)
      .not("guest_phone", "is", null);

    // Merge them for a complete CRM view
    const guestMap = new Map();
    guests?.forEach(g => {
      if (!guestMap.has(g.guest_phone)) {
        guestMap.set(g.guest_phone, {
          id: `guest-${g.guest_phone}`,
          full_name: g.guest_name,
          phone: g.guest_phone,
          is_guest: true,
          created_at: new Date().toISOString(), // Fallback
          appointments: [{ count: 0 }] // We'll count later if needed
        });
      }
    });

    const merged = [
      ...(profiles || []).map(p => ({ ...p, is_guest: false })),
      ...Array.from(guestMap.values()).filter(g => !profiles?.some(p => p.phone === g.phone))
    ];

    setClients(merged);
    setLoading(false);
  }

  const handleAddClient = async () => {
    if (!formData.full_name || !formData.phone) {
      toast({ title: "Erro", description: "Nome e telefone são obrigatórios.", variant: "destructive" });
      return;
    }

    // Creating a profile manually for a client
    // Since id is primary key and likely not serial, we might need a gen_random_uuid() or handle it
    const { error } = await supabase.from("profiles").insert({
      id: crypto.randomUUID(),
      full_name: formData.full_name,
      phone: formData.phone
    });

    if (error) {
      toast({ title: "Erro ao criar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Cliente cadastrado." });
      setIsOpen(false);
      setFormData({ full_name: "", phone: "", email: "" });
      fetchClients();
    }
  };

  const filteredClients = clients.filter(c => 
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Clientes" 
          description="Gerencie sua base de clientes e histórico de fidelidade."
        />
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsOpen(true)}
            className="rounded-xl shadow-lg shadow-primary/20 h-10 px-6 font-bold uppercase text-xs"
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Cliente
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Buscar por nome ou telefone..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary/50 outline-none transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-xl border-border/40">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 w-full bg-muted/20 animate-pulse rounded-2xl" />
          ))
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card 
              key={client.id} 
              className="rounded-2xl border-none bg-white shadow-sm hover:shadow-md hover:bg-slate-50 transition-all group cursor-pointer"
              onClick={() => !client.is_guest && navigate(`/app/clientes/${client.id}`)}
            >
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full ${client.is_guest ? 'bg-muted' : 'bg-secondary'} flex items-center justify-center text-lg font-bold`}>
                    {client.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold leading-none flex items-center gap-2">
                      {client.full_name || "Sem nome"}
                      {client.is_guest && (
                        <Badge variant="outline" className="text-[8px] uppercase h-4 px-1 border-amber-500/30 text-amber-500">Visitante</Badge>
                      )}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Agendamentos</p>
                    <p className="font-bold text-lg leading-none">{client.appointments?.[0]?.count || 0}</p>
                  </div>
                  {!client.is_guest && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  {client.is_guest && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 rounded-lg text-[10px] font-black uppercase bg-primary/10 text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ full_name: client.full_name, phone: client.phone, email: "" });
                        setIsOpen(true);
                      }}
                    >
                      <UserPlus className="h-3 w-3 mr-1" /> Efetivar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-12 text-center text-muted-foreground italic border border-dashed border-border/40 rounded-2xl">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="Ex: João Silva" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="(99) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label>E-mail (Opcional)</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="joao@email.com" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddClient} className="w-full uppercase font-bold tracking-widest h-12">Salvar Cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
