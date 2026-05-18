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
      color: "bg-emerald-500",
    },
    {
      title: "Faturamento Total",
      value: totalRevenue || 0,
      change: `+${(sales || []).length}`,
      trend: "up",
      icon: TrendingUp,
      color: "bg-gold-500",
    },
    {
      title: "Total de Vendas",
      value: (sales || []).length,
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-gold-600",
    },
    {
      title: "Ticket Médio",
      value: (sales && sales.length > 0) ? (totalRevenue / sales.length) : 0,
      change: "+5.4%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-slate-900",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-950 p-6 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 md:w-64 md:h-64 bg-gold-500/20 rounded-full blur-[80px] md:blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
          <div className="space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gold-400">
              <Zap size={10} className="fill-gold-400 md:size-[12px]" />
              Smokings Premium System
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Visão Geral da <br className="hidden sm:block" />
              Sua <span className="gold-text-gradient">Tabacaria</span>
            </h1>
            <p className="text-slate-400 max-w-md text-xs md:text-base">
              Acompanhe seu desempenho financeiro e gestão de clientes com inteligência e elegância.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {(user?.isOwner || user?.email === 'smokings@smokings.com') && (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="w-full md:w-auto gap-2 h-12 md:h-14 bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <RefreshCw size={18} className={cn(isSyncing && "animate-spin")} />
                {isSyncing ? "Sincronizando..." : "Sincronizar Banco"}
              </Button>
            )}
            <Button variant="premium" size="lg" className="w-full md:w-auto gap-2 group h-12 md:h-14 bg-gold-600 hover:bg-gold-700 text-black font-black shadow-xl shadow-gold-500/20">
              Relatório Completo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
              <Calendar size={16} className="md:size-[18px]" />
              <span className="text-xs md:text-sm font-semibold">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="premium-card border-none group overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-2 md:mb-4">
                  <div className={cn("p-2 md:p-3 rounded-xl md:rounded-2xl text-white shadow-lg", stat.color)}>
                    <stat.icon size={16} className="md:size-[20px]" />
                  </div>
                </div>
                <div className="space-y-0.5 md:space-y-1">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.title}</p>
                  <h3 className="text-lg md:text-2xl font-black tracking-tight truncate">
                    {typeof stat.value === "number" && (stat.title.includes("Receita") || stat.title.includes("Ticket"))
                      ? formatCurrency(stat.value).replace(",00", "")
                      : stat.value}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-2 md:mt-4 pt-2 md:pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-black",
                    stat.trend === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  )}>
                    {stat.trend === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Charts Section */}
        <Card className="lg:col-span-8 border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 md:p-8 pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <CardTitle className="text-xl md:text-2xl font-black tracking-tight">Performance Analítica</CardTitle>
                <CardDescription className="text-xs md:text-sm font-medium">Faturamento da última semana</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl bg-gold-500/10 border border-gold-500/20 text-[8px] md:text-[10px] font-bold text-gold-600 uppercase">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold-500" />
                  Receita
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[400px] p-4 md:p-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5b10a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f5b10a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
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
                  cursor={{ stroke: '#f5b10a', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '1.5rem',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '1rem'
                  }}
                  itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                  labelStyle={{ fontWeight: 800, color: '#f5b10a', marginBottom: '0.5rem', fontSize: '14px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="faturamento" 
                  stroke="#f5b10a" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="gastos" 
                  stroke="#64748b" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Section */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none premium-shadow bg-gold-500 rounded-[2rem] text-white overflow-hidden relative group h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
            <CardHeader className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Zap size={20} className="fill-white" />
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">Smokings AI</CardTitle>
              </div>
              <CardDescription className="text-white/80 font-medium">Insights e recomendações automáticas para o seu negócio.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {(sales && sales.length > 0) ? (
                <>
                  <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                      <TrendingUp size={16} />
                      Desempenho Estelar
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed font-medium">
                      Seu faturamento atual está <span className="font-black text-white underline">12% acima</span> da média mensal. Considere investir em reposição de estoque premium.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                      <Users size={16} />
                      Retenção de Clientes
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed font-medium">
                      Notamos que <span className="font-black text-white underline">4 novos clientes</span> não retornaram esta semana. Que tal criar uma promoção para "Comandas" ativas?
                    </p>
                  </div>
                  <Link href="/dashboard/ai" className="w-full">
                    <Button variant="premium" className="w-full h-14 rounded-2xl bg-slate-950 text-white border-none mt-4 font-bold tracking-tight">
                      Ver Todos os Insights
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="p-10 text-center border-2 border-dashed border-white/30 rounded-3xl">
                  <p className="text-sm text-white/80 font-bold italic leading-relaxed">
                    Aguardando processamento de dados para ativar os algoritmos de inteligência...
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
