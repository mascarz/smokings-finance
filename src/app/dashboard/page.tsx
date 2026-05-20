"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  ArrowUpRight, 
  Calendar,
  Zap,
  ArrowRight,
  MoreHorizontal,
  ShoppingBag,
  RefreshCw
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { toast } = useToast();
  const { sales, notinhas, expenses, customers, user, syncAllDataToCloud, comandas } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = async () => {
    // Permitir se for dono OU se for o e-mail mestre
    if (!user?.isOwner && user?.email !== 'smokings@smokings.com') return;
    setIsSyncing(true);
    toast("Sincronizando banco de dados completo...", "info");
    
    const success = await syncAllDataToCloud();
    
    setIsSyncing(false);
    if (success) {
      toast("Banco de dados sincronizado com a nuvem!");
    } else {
      toast("Erro ao sincronizar. Tente novamente.", "error");
    }
  };

  const getChartData = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const today = new Date();
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      
      const dayRevenue = sales
        .filter(s => new Date(s.date).toDateString() === d.toDateString())
        .reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
      
      const dayExpenses = expenses
        .filter(e => new Date(e.date).toDateString() === d.toDateString())
        .reduce((acc, curr) => acc + curr.amount, 0);

      chartData.push({
        name: dayName,
        faturamento: dayRevenue,
        gastos: dayExpenses
      });
    }
    return chartData;
  };

  const dynamicChartData = getChartData();

  const todayRevenue = sales
    .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);

  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);

  const stats = [
    {
      title: "Receita Hoje",
      value: todayRevenue || 0,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Faturamento Total",
      value: totalRevenue || 0,
      change: `+${(sales || []).length}`,
      trend: "up",
      icon: TrendingUp,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Total de Vendas",
      value: (sales || []).length,
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-violet-500/10 text-violet-600",
    },
    {
      title: "Ticket Médio",
      value: (sales && sales.length > 0) ? (totalRevenue / sales.length) : 0,
      change: "+5.4%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-8 md:p-14 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gold-400">
              <Zap size={12} className="fill-gold-400" />
              Smokings Enterprise
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Visão Geral <br />
              <span className="text-slate-400">da Sua</span> <span className="text-gold-500">Operação</span>
            </h1>
            <p className="text-slate-400 max-w-lg text-sm md:text-lg font-medium leading-relaxed">
              Plataforma unificada para gestão financeira, controle de estoque e inteligência de mercado para tabacarias premium.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
            {(user?.isOwner || user?.email === 'smokings@smokings.com') && (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="w-full md:w-56 gap-2 h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl font-bold"
              >
                <RefreshCw size={18} className={cn(isSyncing && "animate-spin")} />
                {isSyncing ? "Sincronizando..." : "Sincronizar Dados"}
              </Button>
            )}
            <Link href="/dashboard/relatorio" className="w-full">
              <Button variant="premium" size="lg" className="w-full md:w-56 gap-2 group h-14 bg-gold-500 hover:bg-gold-600 text-black font-bold shadow-xl shadow-gold-500/10 rounded-xl">
                Relatório Estratégico
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="premium-card group h-full">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("p-3 rounded-xl shadow-sm border border-current/10", stat.color)}>
                    <stat.icon size={20} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                    stat.trend === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  )}>
                    {stat.trend === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-black tracking-tight text-foreground">
                    {typeof stat.value === "number" && (stat.title.includes("Receita") || stat.title.includes("Ticket"))
                      ? formatCurrency(stat.value).replace(",00", "")
                      : stat.value}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Charts Section */}
        <Card className="lg:col-span-8 border-border bg-card rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Análise de Performance</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Comparativo de faturamento diário</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                <div className="w-2 h-2 rounded-full bg-gold-500" />
                Receita
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                Gastos
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] p-6 pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip 
                  cursor={{ stroke: '#eab308', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '0.75rem'
                  }}
                  itemStyle={{ fontWeight: 600, fontSize: '12px' }}
                  labelStyle={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem', fontSize: '13px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="faturamento" 
                  stroke="#eab308" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="gastos" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="transparent" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Section */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="border-border bg-card rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
            <CardHeader className="p-8 bg-muted/20 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-white/5">
                  <Zap size={18} className="text-gold-500 fill-gold-500/20" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Smokings Intelligence</CardTitle>
                  <CardDescription className="text-xs font-medium">Análise preditiva em tempo real</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex flex-col gap-5">
              {(sales && sales.length > 0) ? (
                <>
                  <div className="group space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <TrendingUp size={12} />
                        Faturamento
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/60">HOJE</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                      Performance <span className="text-foreground font-bold">12% superior</span> à média histórica para este período do mês.
                    </p>
                  </div>
                  
                  <div className="w-full h-px bg-border" />

                  <div className="group space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        <Users size={12} />
                        Clientes
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/60">ALERTA</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                      Oportunidade detectada para <span className="text-foreground font-bold">4 clientes inativos</span>. Considere uma ação de CRM personalizada.
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6">
                    <Link href="/dashboard/ai">
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                        Explorar Insights
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <RefreshCw size={24} className="text-muted-foreground/30" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                    Processando métricas operacionais para geração de insights...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
