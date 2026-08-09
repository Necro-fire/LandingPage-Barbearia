import { useState, useEffect } from "react";
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  Plus, 
  Filter,
  Download,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  MoreVertical
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinancePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  useEffect(() => {
    async function fetchFinanceData() {
      setLoading(true);
      const { data } = await supabase
        .from("transactions")
        .select(`
          *,
          barber:barber_id(display_name)
        `)
        .order("occurred_at", { ascending: false });

      if (data) {
        setTransactions(data);
        const income = data
          .filter(t => t.type === 'income')
          .reduce((acc, curr) => acc + curr.amount, 0);
        const expense = data
          .filter(t => t.type === 'expense')
          .reduce((acc, curr) => acc + curr.amount, 0);
        
        setStats({
          income,
          expense,
          balance: income - expense
        });
      }
      setLoading(false);
    }
    fetchFinanceData();
  }, []);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'pix':
        return <Smartphone className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Cartão Crédito';
      case 'debit_card': return 'Cartão Débito';
      case 'pix': return 'PIX';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Gestão Financeira" 
          description="Controle de receitas, despesas e fluxo de caixa."
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-border/60">
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> Nova Transação
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          label="Receitas (Mês)" 
          value={`R$ ${stats.income.toFixed(2)}`} 
          hint="Total de entradas" 
          icon={ArrowUpCircle} 
          className="bg-green-500/5 border-green-500/20"
        />
        <StatCard 
          label="Despesas (Mês)" 
          value={`R$ ${stats.expense.toFixed(2)}`} 
          hint="Total de saídas" 
          icon={ArrowDownCircle}
          className="bg-red-500/5 border-red-500/20"
        />
        <StatCard 
          label="Saldo Atual" 
          value={`R$ ${stats.balance.toFixed(2)}`} 
          hint="Lucro líquido projetado" 
          icon={TrendingUp}
          className="bg-primary/5 border-primary/20"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b border-border/40 py-4 px-6">
            <CardTitle className="text-lg font-heading">Movimentações Recentes</CardTitle>
            <Button variant="ghost" size="sm" className="rounded-lg h-8 px-2 border border-border/40">
              <Filter className="h-3 w-3 mr-2" /> Filtrar
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 h-16 animate-pulse bg-muted/10" />
                ))
              ) : transactions.length > 0 ? (
                transactions.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center",
                        t.type === 'income' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {t.type === 'income' ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-none">{t.description || (t.type === 'income' ? 'Serviço Realizado' : 'Despesa')}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                             <Calendar className="h-3 w-3" /> {format(new Date(t.occurred_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                           </span>
                           {t.payment_method && (
                             <Badge variant="outline" className="text-[9px] py-0 h-4 rounded px-1 flex items-center gap-1 border-border/60">
                               {getPaymentIcon(t.payment_method)} {getPaymentLabel(t.payment_method)}
                             </Badge>
                           )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "text-sm font-black font-heading",
                        t.type === 'income' ? "text-green-500" : "text-red-500"
                      )}>
                        {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem className="rounded-lg">Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg text-red-500">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-muted-foreground italic">Nenhuma movimentação registrada.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Resumo por Método</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Cartão', val: '45%', color: 'bg-blue-500' },
                { label: 'PIX', val: '35%', color: 'bg-green-500' },
                { label: 'Dinheiro', val: '20%', color: 'bg-amber-500' }
              ].map(m => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>{m.label}</span>
                    <span className="text-muted-foreground">{m.val}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", m.color)} style={{ width: m.val }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Button variant="outline" className="w-full rounded-xl border-dashed border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all py-8 flex flex-col gap-1">
            <Plus className="h-6 w-6 mb-1" />
            <span className="font-bold uppercase text-[10px] tracking-widest">Fechar Caixa do Dia</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
