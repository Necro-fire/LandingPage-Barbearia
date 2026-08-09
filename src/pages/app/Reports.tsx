import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Scissors, 
  Calendar, 
  AlertCircle, 
  Download,
  FileText,
  FileSpreadsheet,
  ChevronRight
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const reportCategories = [
    {
      title: "Financeiro",
      description: "Receita bruta, líquida e ticket médio.",
      icon: TrendingUp,
      reports: ["Receita Mensal", "Serviços mais Lucrativos", "Fluxo de Caixa"]
    },
    {
      title: "Desempenho",
      description: "Produtividade por profissional e ocupação.",
      icon: Users,
      reports: ["Ranking de Barbeiros", "Horários de Pico", "Taxa de Ocupação"]
    },
    {
      title: "Operacional",
      description: "Serviços, cancelamentos e agendamentos.",
      icon: Scissors,
      reports: ["Volume de Serviços", "Motivos de Cancelamento", "Retenção de Clientes"]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Relatórios e Inteligência" 
          description="Analise o crescimento e a eficiência da sua barbearia."
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-border/60">
            <FileText className="h-4 w-4 mr-2" /> PDF
          </Button>
          <Button variant="outline" className="rounded-xl border-border/60">
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Crescimento" value="+12%" hint="Vs. mês anterior" icon={TrendingUp} className="bg-green-500/5 border-green-500/20" />
        <StatCard label="Novos Clientes" value="48" hint="Este mês" icon={Users} className="bg-primary/5 border-primary/20" />
        <StatCard label="Taxa de Cancelamento" value="3.2%" hint="Queda de 0.5%" icon={AlertCircle} className="bg-red-500/5 border-red-500/20" />
        <StatCard label="Ocupação Geral" value="86%" hint="Alta demanda" icon={Calendar} className="bg-blue-500/5 border-blue-500/20" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportCategories.map((cat, i) => (
          <Card key={i} className="rounded-2xl border-border/60 bg-card/60 backdrop-blur hover:shadow-lg transition-all group">
            <CardHeader>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <cat.icon className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading">{cat.title}</CardTitle>
              <CardDescription>{cat.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {cat.reports.map((report, j) => (
                <Button 
                  key={j} 
                  variant="ghost" 
                  className="w-full justify-between rounded-xl hover:bg-primary/5 group/btn"
                >
                  <span className="text-sm">{report}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/40">
          <CardTitle className="text-lg font-heading">Visão Geral de Desempenho</CardTitle>
          <CardDescription>Comparativo mensal de receita e atendimentos.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 flex flex-col items-center justify-center text-muted-foreground italic min-h-[300px]">
          <BarChart className="h-16 w-16 mb-4 opacity-20" />
          <p>Gráficos analíticos serão carregados aqui após processamento dos dados históricos.</p>
        </CardContent>
      </Card>
    </div>
  );
}
