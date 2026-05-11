"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter, 
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  Activity
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
  Area,
  PieChart,
  Cell,
  Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";

export default function FinanceiroPage() {
  const { toast } = useToast();
  const { sales, expenses } = useApp();

  // Calcular dados mensais dinâmicos
  const getMonthlyData = () => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentYear = new Date().getFullYear();
    const data = [];

    // Mostrar os últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = months[d.getMonth()];
      
      const monthRevenue = sales
        .filter(s => {
          const sDate = new Date(s.date);
          return sDate.getMonth() === d.getMonth() && sDate.getFullYear() === d.getFullYear();
        })
        .reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
      
      const monthExpenses = expenses
        .filter(e => {
          const eDate = new Date(e.date);
          return eDate.getMonth() === d.getMonth() && eDate.getFullYear() === d.getFullYear();
        })
        .reduce((acc, curr) => acc + curr.amount, 0);

      data.push({
        name: monthName,
        receita: monthRevenue,
        despesa: monthExpenses
      });
    }
    return data;
  };

  const dynamicMonthlyData = getMonthlyData();

  // Calcular distribuição por categoria real
  const getCategoryData = () => {
    // Como não temos categoria explícita nas vendas ainda, vamos simular ou usar "Vendas"
    const totalSales = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
    if (totalSales === 0) return [];
    
    return [
      { name: "Vendas Diretas", value: totalSales, color: "#f5b10a" },
    ];
  };

  const dynamicCategoryData = getCategoryData();

  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const stats = [
    { label: "Faturamento Total", value: totalRevenue, change: "+100%", trend: "up" },
    { label: "Lucro Líquido", value: netProfit, change: netProfit >= 0 ? "+100%" : "-100%", trend: netProfit >= 0 ? "up" : "down" },
    { label: "Despesas Totais", value: totalExpenses, change: "+100%", trend: "down" },
    { label: "Ticket Médio", value: sales.length > 0 ? totalRevenue / sales.length : 0, change: "+100%", trend: "up" },
  ];

  const handleExport = () => {
    const columns = ["Mês", "Receita", "Despesa"];
    exportToPDF("Relatório Financeiro Mensal", dynamicMonthlyData, columns);
    toast("Relatório exportado com sucesso!");
  };

  const handleFilter = () => {
    toast("Abrindo painel de filtros...", "info");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análise Financeira</h1>
          <p className="text-muted-foreground">Relatórios detalhados e indicadores de performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleFilter}>
            <Filter size={18} /> Filtrar
          </Button>
          <Button variant="premium" className="flex items-center gap-2" onClick={handleExport}>
            <Download size={18} /> Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/30">
              <CardContent className="pt-6">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{formatCurrency(stat.value)}</h3>
                    <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${
                      stat.trend === "up" ? "text-emerald-500" : "text-rose-500"
                    }`}>
                      {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <Activity size={20} className="text-primary/40" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Receita vs Despesas</CardTitle>
            <CardDescription>Comparativo mensal de faturamento e custos</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                />
                <Bar dataKey="receita" fill="#f5b10a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesa" fill="#18181b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>Produtos que mais geram faturamento</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col items-center justify-center">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dynamicCategoryData}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dynamicCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              {dynamicCategoryData.length === 0 ? (
                <p className="col-span-full text-center text-xs text-muted-foreground">Sem dados para exibir.</p>
              ) : (
                dynamicCategoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">{cat.name}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time stats section */}
      <Card className="border-none shadow-xl bg-black text-white dark:bg-white dark:text-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white dark:text-black">Estatísticas em Tempo Real</CardTitle>
              <CardDescription className="text-white/60 dark:text-black/60">Acompanhamento ao vivo das transações</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/50 dark:text-black/50">Vendas hoje</p>
              <p className="text-3xl font-bold">42</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/50 dark:text-black/50">Clientes atuais</p>
              <p className="text-3xl font-bold">8</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/50 dark:text-black/50">Tempo médio</p>
              <p className="text-3xl font-bold">18m</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/50 dark:text-black/50">Taxa de conversão</p>
              <p className="text-3xl font-bold">64%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
