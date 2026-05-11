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
  Zap
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

export default function DashboardPage() {
  const { toast } = useToast();
  const { sales, notinhas, expenses, customers } = useApp();

  // Calcular faturamento por dia da semana para o gráfico
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
      title: "Faturamento Hoje",
      value: todayRevenue,
      change: "+100%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Novos Clientes",
      value: customers.length,
      change: "+100%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Vendas Realizadas",
      value: sales.length,
      change: "+100%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Ticket Médio",
      value: sales.length > 0 ? todayRevenue / sales.length : 0,
      change: "+100%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Geral</h1>
          <p className="text-muted-foreground">Aqui está o que está acontecendo na Smokings hoje.</p>
        </div>
        <div 
          className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl border border-border cursor-pointer hover:bg-accent transition-colors"
          onClick={() => toast("Calendário de eventos em breve!", "info")}
        >
          <Calendar size={18} className="text-muted-foreground" />
          <span className="text-sm font-medium">10 de Maio, 2026</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toast(`Abrindo detalhes de ${stat.title}...`, "info")}
          >
            <Card className="hover:border-primary/20 transition-colors cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <stat.icon size={16} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof stat.value === "number" && stat.title.includes("Faturamento") || stat.title.includes("Ticket")
                    ? formatCurrency(stat.value)
                    : stat.value}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp size={14} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={14} className="text-rose-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-emerald-500 text-xs font-bold" : "text-rose-500 text-xs font-bold"}>
                    {stat.change}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">em relação a ontem</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-none shadow-xl bg-gradient-to-br from-card to-secondary/30">
          <CardHeader>
            <CardTitle>Visão Geral de Faturamento</CardTitle>
            <CardDescription>Acompanhe o desempenho diário da sua tabacaria</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicChartData}>
                <defs>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5b10a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f5b10a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#f5b10a' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="faturamento" 
                  stroke="#f5b10a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorFaturamento)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>IA Financeira</CardTitle>
              <CardDescription>Insights inteligentes para seu negócio</CardDescription>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
              <Zap size={20} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sales.length > 0 ? (
              <>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gold-600">
                    <TrendingUp size={16} />
                    Tendência de Alta
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Seu faturamento está crescendo. Continue registrando suas vendas para insights mais precisos.
                  </p>
                </div>
                {expenses.length > 0 && (
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-500">
                      <TrendingDown size={16} />
                      Alerta de Gastos
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lembre-se de sempre comparar seus gastos com o faturamento bruto para manter a margem de lucro.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-2xl">
                <p className="text-sm text-muted-foreground italic">Aguardando dados de vendas para gerar insights inteligentes...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
