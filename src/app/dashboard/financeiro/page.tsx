"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Globe,
  Activity,
  ChevronRight,
  Zap,
  Users
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Cell,
  Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";

export default function FinanceiroPage() {
  const { toast } = useToast();
  const { sales, expenses, employees } = useApp();
  const [segmentation, setSegmentation] = useState<'category' | 'employee' | 'source'>('category');

  const getMonthlyData = () => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const data = [];

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

  const getSegmentedData = () => {
    if (segmentation === 'category') {
      const cats = Array.from(new Set(sales.map(s => s.product.split(' ')[0]))); // Simplificação por categoria
      return cats.slice(0, 5).map(cat => ({
        name: cat,
        value: sales.filter(s => s.product.startsWith(cat)).reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      }));
    } else if (segmentation === 'employee') {
      if (employees.length === 0) return [{ name: "Sem dados", value: 1, color: "#e2e8f0" }];
      return employees.map(emp => ({
        name: emp.name,
        value: sales.length * (Math.random() + 0.5) * 100, // Simulação já que vendas não tem funcionário vinculado ainda
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      }));
    } else {
      const totalSales = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
      return [
        { name: "Vendas Diretas", value: totalSales * 0.7, color: "#f5b10a" },
        { name: "Comandas", value: totalSales * 0.2, color: "#1e293b" },
        { name: "Notinhas", value: totalSales * 0.1, color: "#64748b" },
      ];
    }
  };

  const dynamicCategoryData = getSegmentedData();

  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const stats = [
    { label: "Receita Líquida", value: totalRevenue, change: "+12.4%", trend: "up", color: "text-emerald-600" },
    { label: "Margem de Lucro", value: netProfit, change: "+8.2%", trend: "up", color: "text-gold-600" },
    { label: "Custos Operacionais", value: totalExpenses, change: "-2.1%", trend: "down", color: "text-rose-600" },
    { label: "Capital de Giro", value: totalRevenue * 0.4, change: "+5.7%", trend: "up", color: "text-indigo-600" },
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    toast(`Gerando relatório em ${format.toUpperCase()}...`, "info");
    setTimeout(() => {
      if (format === 'pdf') {
        const columns = ["Mês", "Receita", "Despesa"];
        exportToPDF("Relatório Financeiro Global - Smokings", dynamicMonthlyData, columns);
      } else {
        exportToExcel("Relatório Financeiro Global - Smokings", dynamicMonthlyData);
      }
      toast(`Relatório exportado com sucesso!`, "success");
    }, 1500);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950 dark:bg-white/10 border border-slate-950/10 dark:border-white/20 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-950 dark:text-white">
            <Globe size={10} className="md:size-[12px]" />
            Enterprise Analytics
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">Análise <span className="gold-text-gradient">Financeira</span></h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Indicadores globais e inteligência de mercado.</p>
        </div>
        <div className="flex gap-2 md:gap-3">
          <Button variant="outline" size="lg" className="flex-1 md:flex-none rounded-xl md:rounded-2xl h-12 md:h-14 px-4 md:px-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => handleExport('excel')}>
            <Download size={18} className="md:mr-2 text-slate-400" />
            <span className="hidden md:inline">Excel</span>
          </Button>
          <Button variant="gold" size="lg" className="flex-1 md:flex-none rounded-xl md:rounded-2xl h-12 md:h-14 px-4 md:px-8 shadow-xl shadow-gold-500/20" onClick={() => handleExport('pdf')}>
            <Download size={18} className="md:mr-2" />
            <span className="hidden md:inline">Exportar PDF</span>
            <span className="md:hidden">PDF</span>
          </Button>
        </div>
      </div>

      {/* High-Level Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="premium-card border-none group overflow-hidden h-full">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-2 md:mb-4">
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 truncate">{stat.label}</p>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                    <Activity size={12} className="md:size-[16px]" />
                  </div>
                </div>
                <h3 className="text-base md:text-2xl font-black tracking-tighter mb-1 md:mb-2 truncate">{formatCurrency(stat.value).replace(",00", "")}</h3>
                <div className="flex items-center gap-1.5">
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

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Chart Card */}
        <Card className="lg:col-span-8 border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 md:p-8 pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <CardTitle className="text-xl md:text-2xl font-black tracking-tight leading-none mb-1 md:mb-2">Fluxo de Caixa</CardTitle>
                <CardDescription className="text-xs md:text-sm font-medium">Performance mensal consolidada</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Receita</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gastos</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[450px] p-4 md:p-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicMonthlyData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(v) => `R$${v/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)', radius: 6 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    border: 'none', 
                    borderRadius: '1rem',
                    padding: '0.75rem',
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
                  }}
                  itemStyle={{ fontWeight: 800, fontSize: '10px' }}
                  labelStyle={{ fontWeight: 900, color: '#f5b10a', marginBottom: '0.5rem', fontSize: '12px' }}
                />
                <Bar dataKey="receita" fill="#f5b10a" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="despesa" fill="currentColor" className="text-slate-950 dark:text-white" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          {/* Revenue Mix Card */}
          <Card className="border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
            <CardHeader className="p-6 md:p-8 pb-2 text-center">
              <div className="flex flex-col gap-4">
                <CardTitle className="text-lg md:text-xl font-black tracking-tight uppercase">Análise Segmentada</CardTitle>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setSegmentation('category')}
                    className={cn("flex-1 text-[9px] font-black uppercase py-2 rounded-lg transition-all", segmentation === 'category' ? "bg-white dark:bg-slate-700 shadow-sm text-gold-600" : "text-slate-400")}
                  >
                    Cat.
                  </button>
                  <button 
                    onClick={() => setSegmentation('employee')}
                    className={cn("flex-1 text-[9px] font-black uppercase py-2 rounded-lg transition-all", segmentation === 'employee' ? "bg-white dark:bg-slate-700 shadow-sm text-gold-600" : "text-slate-400")}
                  >
                    Func.
                  </button>
                  <button 
                    onClick={() => setSegmentation('source')}
                    className={cn("flex-1 text-[9px] font-black uppercase py-2 rounded-lg transition-all", segmentation === 'source' ? "bg-white dark:bg-slate-700 shadow-sm text-gold-600" : "text-slate-400")}
                  >
                    Origem
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col items-center">
              <div className="w-full h-[180px] md:h-[240px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dynamicCategoryData}
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dynamicCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Total</span>
                  <span className="text-xl font-black tracking-tighter">{formatCurrency(totalRevenue).split(',')[0]}</span>
                </div>
              </div>
              <div className="w-full space-y-2 mt-4">
                {dynamicCategoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase">{cat.name}</span>
                    </div>
                    <span className="text-[10px] font-black">{Math.round((cat.value / (totalRevenue || 1)) * 100)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          <Card className="border-none bg-gradient-to-br from-gold-400 to-gold-600 rounded-[1.5rem] md:rounded-[2rem] text-white p-6 md:p-8 relative overflow-hidden group cursor-pointer shadow-xl shadow-gold-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Zap size={20} className="fill-white md:size-[24px]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg md:text-xl font-black tracking-tight">Otimização de Lucro</h4>
                <p className="text-white/80 text-[10px] md:text-xs font-bold leading-relaxed">
                  IA identificou oportunidade de redução de custos em 15%.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                Ver recomendação <ChevronRight size={14} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Global Benchmarking Section */}
      <Card className="border-none shadow-2xl bg-slate-950 text-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 rounded-full blur-[100px] md:blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Activity size={16} className="md:size-[20px]" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Health Score</span>
            </div>
            <h5 className="text-3xl md:text-4xl font-black tracking-tighter">98.2<span className="text-lg md:text-xl text-white/40">/100</span></h5>
            <p className="text-white/50 text-[10px] md:text-xs font-medium leading-relaxed">Eficiência global AAA.</p>
          </div>
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-2 text-gold-400">
              <TrendingUp size={16} className="md:size-[20px]" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Crescimento</span>
            </div>
            <h5 className="text-3xl md:text-4xl font-black tracking-tighter">+24.5%</h5>
            <p className="text-white/50 text-[10px] md:text-xs font-medium leading-relaxed">Faturamento líquido ajustado.</p>
          </div>
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Users size={16} className="md:size-[20px]" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Retenção</span>
            </div>
            <h5 className="text-3xl md:text-4xl font-black tracking-tighter">8.4x</h5>
            <p className="text-white/50 text-[10px] md:text-xs font-medium leading-relaxed">Frequência trimestral.</p>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <Button variant="premium" size="lg" className="w-full sm:w-auto h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-[1.5rem] bg-white text-slate-950 hover:bg-slate-100 font-black tracking-tight shadow-xl">
              Configurar Alertas
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
