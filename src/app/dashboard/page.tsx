"use client";

import React from "react";
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
  MoreHorizontal
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
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { toast } = useToast();
  const { sales, notinhas, expenses, customers } = useApp();

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

  const stats = [
    {
      title: "Receita Hoje",
      value: todayRevenue,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-gold-500",
    },
    {
      title: "Novos Clientes",
      value: customers.length,
      change: "+3",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total de Vendas",
      value: sales.length,
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-emerald-500",
    },
    {
      title: "Ticket Médio",
      value: sales.length > 0 ? todayRevenue / sales.length : 0,
      change: "+5.4%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-gold-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gold-400">
              <Zap size={12} className="fill-gold-400" />
              Smokings Premium System
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Visão Geral da <br />
              Sua <span className="gold-text-gradient">Tabacaria</span>
            </h1>
            <p className="text-slate-400 max-w-md text-sm md:text-base">
              Acompanhe seu desempenho financeiro e gestão de clientes com inteligência e elegância.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Button variant="gold" size="lg" className="w-full md:w-auto gap-2 group">
              Baixar Relatório Completo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
              <Calendar size={18} />
              <span className="text-sm font-semibold">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="premium-card group border-none">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                    <stat.icon size={20} />
                  </div>
                  <button className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                  <h3 className="text-2xl font-black tracking-tight">
                    {typeof stat.value === "number" && (stat.title.includes("Receita") || stat.title.includes("Ticket"))
                      ? formatCurrency(stat.value)
                      : stat.value}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black",
                    stat.trend === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  )}>
                    {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.change}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">vs. último período</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Charts Section */}
        <Card className="lg:col-span-8 border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex justify-between items-end">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Performance Analítica</CardTitle>
                <CardDescription className="text-sm font-medium">Fluxo de receita e gastos da última semana</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-[10px] font-bold text-gold-600 uppercase">
                  <div className="w-2 h-2 rounded-full bg-gold-500" />
                  Receita
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  Gastos
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] p-8">
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
              {sales.length > 0 ? (
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
                  <Button variant="premium" className="w-full h-14 rounded-2xl bg-slate-950 text-white border-none mt-4 font-bold tracking-tight">
                    Ver Todos os Insights
                  </Button>
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

import { cn } from "@/lib/utils";
