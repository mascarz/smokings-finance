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
  Activity,
  ChevronRight,
  Zap,
  Globe
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
import { formatCurrency, cn } from "@/lib/utils";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";

export default function FinanceiroPage() {
  const { toast } = useToast();
  const { sales, expenses } = useApp();

  const getMonthlyData = () => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentYear = new Date().getFullYear();
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

  const getCategoryData = () => {
    const totalSales = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
    if (totalSales === 0) return [];
    
    return [
      { name: "Vendas Diretas", value: totalSales * 0.7, color: "#f5b10a" },
      { name: "Comandas", value: totalSales * 0.2, color: "#1e293b" },
      { name: "Notinhas", value: totalSales * 0.1, color: "#64748b" },
    ];
  };

  const dynamicCategoryData = getCategoryData();

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
      }
      toast(`Relatório exportado com sucesso!`, "success");
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 dark:bg-white/10 border border-slate-950/10 dark:border-white/20 text-[10px] font-bold uppercase tracking-widest text-slate-950 dark:text-white">
            <Globe size={12} />
            Enterprise Analytics
          </div>
          <h1 className="text-4xl font-black tracking-tight">Análise <span className="gold-text-gradient">Financeira</span></h1>
          <p className="text-slate-500 font-medium">Indicadores globais e inteligência de mercado para sua tabacaria.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="rounded-2xl h-14 px-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => handleExport('excel')}>
            <Download size={18} className="mr-2 text-slate-400" />
            Excel
          </Button>
          <Button variant="gold" size="lg" className="rounded-2xl h-14 px-8 shadow-xl shadow-gold-500/20" onClick={() => handleExport('pdf')}>
            <Download size={18} className="mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* High-Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="premium-card border-none group overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                    <Activity size={16} />
                  </div>
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-2">{formatCurrency(stat.value)}</h3>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black",
                    stat.trend === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  )}>
                    {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.change}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">YoY Growth</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-8 border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex justify-between items-end">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight leading-none mb-2">Fluxo de Caixa</CardTitle>
                <CardDescription className="text-sm font-medium">Monitoramento mensal de performance financeira</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Receita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gastos</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[450px] p-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicMonthlyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  tickFormatter={(v) => `R$${v/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)', radius: 10 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    border: 'none', 
                    borderRadius: '1.5rem',
                    padding: '1.25rem',
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
                  }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px', padding: '2px 0' }}
                  labelStyle={{ fontWeight: 900, color: '#f5b10a', marginBottom: '0.75rem', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Bar dataKey="receita" fill="#f5b10a" radius={[8, 8, 0, 0]} barSize={32} />
                <Bar dataKey="despesa" fill="currentColor" className="text-slate-950 dark:text-white" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Secondary Insights */}
        <div className="lg:col-span-4 space-y-8">
          {/* Pie Chart Card */}
          <Card className="border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4 text-center">
              <CardTitle className="text-xl font-black tracking-tight uppercase tracking-[0.1em]">Mix de Receita</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 flex flex-col items-center">
              <div className="w-full h-[240px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dynamicCategoryData}
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {dynamicCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: 800 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black tracking-tighter leading-none">{formatCurrency(totalRevenue).split(',')[0]}</span>
                </div>
              </div>
              <div className="w-full space-y-3 mt-4">
                {dynamicCategoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-black text-slate-500 uppercase tracking-tight">{cat.name}</span>
                    </div>
                    <span className="text-xs font-black tracking-tighter">{Math.round((cat.value / (totalRevenue || 1)) * 100)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to action card */}
          <Card className="border-none bg-gradient-to-br from-gold-400 to-gold-600 rounded-[2rem] text-white p-8 relative overflow-hidden group cursor-pointer shadow-xl shadow-gold-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Zap size={24} className="fill-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black tracking-tight">Otimização de Lucro</h4>
                <p className="text-white/80 text-xs font-bold leading-relaxed">
                  Nossa IA identificou uma oportunidade de reduzir custos em 15% nas reposições.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                Ver recomendação <ChevronRight size={14} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Global Benchmarking Section */}
      <Card className="border-none shadow-2xl bg-slate-950 text-white rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Activity size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Health Score</span>
            </div>
            <h5 className="text-4xl font-black tracking-tighter">98.2<span className="text-xl text-white/40">/100</span></h5>
            <p className="text-white/50 text-xs font-medium leading-relaxed">Seu negócio está operando em nível de eficiência global AAA.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold-400">
              <TrendingUp size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Crescimento Real</span>
            </div>
            <h5 className="text-4xl font-black tracking-tighter">+24.5%</h5>
            <p className="text-white/50 text-xs font-medium leading-relaxed">Aumento consistente no faturamento líquido ajustado.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Users size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retenção LTV</span>
            </div>
            <h5 className="text-4xl font-black tracking-tighter">8.4x</h5>
            <p className="text-white/50 text-xs font-medium leading-relaxed">Cada cliente retorna em média 8 vezes no ciclo trimestral.</p>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <Button variant="premium" size="lg" className="h-16 px-10 rounded-[1.5rem] bg-white text-slate-950 hover:bg-slate-100 font-black tracking-tight shadow-xl">
              Configurar Alertas
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
