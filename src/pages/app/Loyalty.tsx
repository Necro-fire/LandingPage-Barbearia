import { useState, useEffect } from "react";
import { 
  Gift, 
  Ticket, 
  Coins, 
  Users, 
  Star, 
  Plus,
  Search,
  ArrowRight
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function LoyaltyPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Programa de Fidelidade" 
          description="Gestão de pontos, cashback, cupons e indicações."
        />
        <Button className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" /> Criar Promoção
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pontos Ativos" value="12.450" hint="Total na base" icon={Star} className="bg-primary/5 border-primary/20" />
        <StatCard label="Cashback Acumulado" value="R$ 1.240,50" hint="Disponível para uso" icon={Coins} className="bg-green-500/5 border-green-500/20" />
        <StatCard label="Cupons Resgatados" value="84" hint="Este mês" icon={Ticket} className="bg-blue-500/5 border-blue-500/20" />
        <StatCard label="Indicações" value="12" hint="+3 esta semana" icon={Users} className="bg-purple-500/5 border-purple-500/20" />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/40 p-1 rounded-xl border border-border/40">
          <TabsTrigger value="overview" className="rounded-lg">Visão Geral</TabsTrigger>
          <TabsTrigger value="coupons" className="rounded-lg">Cupons</TabsTrigger>
          <TabsTrigger value="campaigns" className="rounded-lg">Campanhas</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg">Regras</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Maiores Pontuadores</CardTitle>
                <CardDescription>Clientes mais engajados no programa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "João Silva", points: 850, level: "Premium" },
                  { name: "Maria Oliveira", points: 720, level: "Gold" },
                  { name: "Carlos Santos", points: 640, level: "Gold" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{user.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">{user.points} pts</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Regras de Acúmulo</CardTitle>
                <CardDescription>Como os clientes ganham benefícios.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>Pontos por Real</span>
                    <span className="text-primary">1 pt = R$ 1,00</span>
                  </div>
                  <Progress value={100} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>Cashback</span>
                    <span className="text-primary">5% do valor</span>
                  </div>
                  <Progress value={75} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>Bônus Indicação</span>
                    <span className="text-primary">100 pts</span>
                  </div>
                  <Progress value={50} className="h-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coupons">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { code: "PRIMEIRA10", discount: "10%", type: "Desconto Fixado", active: true },
              { code: "BARBAFDS", discount: "15%", type: "Fim de Semana", active: true },
              { code: "ANIVER20", discount: "20%", type: "Aniversariantes", active: false },
            ].map((coupon, i) => (
              <Card key={i} className="rounded-2xl border-border/60 bg-card/60 backdrop-blur group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <Badge variant={coupon.active ? "default" : "secondary"} className="text-[10px] rounded-lg">
                    {coupon.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-heading tracking-tight">{coupon.code}</CardTitle>
                  <CardDescription>{coupon.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-primary mb-4">{coupon.discount} OFF</div>
                  <Button variant="outline" className="w-full rounded-xl border-border/60 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Editar Cupom
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
