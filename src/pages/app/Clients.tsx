import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true });
      
      if (data) setClients(data);
      setLoading(false);
    }
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Gestão de Clientes" 
          description="Visualize e gerencie o histórico de seus clientes."
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-border/60">
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> Novo Cliente
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card/60 backdrop-blur p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou telefone..." 
            className="pl-10 rounded-xl bg-background/50 border-border/40 focus:border-primary/50"
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
            <Card key={client.id} className="rounded-2xl border-border/60 bg-card/60 backdrop-blur hover:bg-muted/20 transition-colors group">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                    {client.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold leading-none">{client.full_name || "Sem nome"}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone || "N/A"}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Membro desde {new Date(client.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-lg bg-primary/10 text-primary border-none">Fiel</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="rounded-lg">Ver Perfil</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg">Histórico de Cortes</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg text-red-500">Bloquear</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
    </div>
  );
}
