"use client";

import React, { useState } from "react";
import { 
  Printer, 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight,
  ChevronRight,
  FileText,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from "@/lib/context";
import { formatCurrency, cn, filterByDateRange } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from "recharts";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import { useToast } from "@/components/ui/toast";

export default function RelatorioCompletoPage() {
  const { sales, expenses, comandas, notinhas } = useApp();
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState<number | 'today' | 'all'>(30);

  const filteredSales = dateFilter === 'all' ? sales : filterByDateRange(sales, dateFilter);
  const filteredExpenses = dateFilter === 'all' ? expenses : filterByDateRange(expenses, dateFilter);
  
  const totalRevenue = filteredSales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    toast(`Gerando relatório em ${type.toUpperCase()}...`, "info");
    if (type === 'pdf') {
      const data = [
        { Categoria: 'Receita Total', Valor: formatCurrency(totalRevenue) },
        { Categoria: 'Despesas Totais', Valor: formatCurrency(totalExpenses) },
        { Categoria: 'Lucro Líquido', Valor: formatCurrency(netProfit) },
        { Categoria: 'Margem de Lucro', Valor: `${profitMargin.toFixed(2)}%` }
      ];
      exportToPDF("Relatorio_Completo_Smokings", data, ["Categoria", "Valor"]);
    } else {
      const data = [
        { Descrição: 'Receita Total', Valor: totalRevenue },
        { Descrição: 'Despesas Totais', Valor: totalExpenses },
        { Descrição: 'Lucro Líquido', Valor: netProfit },
        { Descrição: 'Margem', Valor: `${profitMargin.toFixed(2)}%` }
      ];
      exportToExcel("Relatorio_Completo_Smokings", data);
    }
  };

  const categoryData = [
    { name: 'Vendas', value: totalRevenue, color: '#f5b10a' },
    { name: 'Despesas', value: totalExpenses, color: '#e11d48' }
  ];

  return (
    <div className="space-y-8 pb-10 print:p-0">
      {/* Header - Hidden on Print if needed, but usually kept */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
            <FileText size={12} />
            Relatório Consolidado
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Relatório <span className="gold-text-gradient">Completo</span></h1>
          <p className="text-sm text-slate-500 font-medium">Visão detalhada de performance e saúde financeira.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-12" onClick={handlePrint}>
            <Printer size={18} className="mr-2" />
            Imprimir
          </Button>
          <Button variant="gold" className="rounded-xl h-12 shadow-lg shadow-gold-500/20" onClick={() => handleExport('pdf')}>
            <Download size={18} className="mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Date Filters - Hidden on Print */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 print:hidden">
        {[
          { label: 'Hoje', value: 'today' },
          { label: '7 Dias', value: 7 },
          { label: '14 Dias', value: 14 },
          { label: '30 Dias', value: 30 },
          { label: 'Tudo', value: 'all' }
        ].map((filter) => (
          <Button
            key={filter.label}
            variant={dateFilter === filter.value ? 'premium' : 'outline'}
            size="sm"
            className="rounded-xl h-10 px-6 whitespace-nowrap font-bold"
            onClick={() => setDateFilter(filter.value as any)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="premium-card border-none bg-emerald-600 text-white shadow-xl shadow-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100/70">Receita Bruta</p>
              <TrendingUp size={16} className="text-emerald-100" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter">{formatCurrency(totalRevenue)}</h3>
            <p className="text-[10px] font-bold text-emerald-100/50 mt-2">Total faturado no período</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-none bg-rose-600 text-white shadow-xl shadow-rose-500/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-100/70">Despesas Totais</p>
              <TrendingDown size={16} className="text-rose-100" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter">{formatCurrency(totalExpenses)}</h3>
            <p className="text-[10px] font-bold text-rose-100/50 mt-2">Total de saídas no período</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-none bg-slate-950 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lucro Líquido</p>
              <DollarSign size={16} className="text-gold-500" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter gold-text-gradient">{formatCurrency(netProfit)}</h3>
            <p className="text-[10px] font-bold text-slate-500 mt-2">Saldo final (Receita - Despesa)</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-none bg-white dark:bg-slate-900 shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Margem de Lucro</p>
              <ArrowUpRight size={16} className="text-indigo-500" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{profitMargin.toFixed(1)}%</h3>
            <p className="text-[10px] font-bold text-slate-500 mt-2">Eficiência do faturamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales vs Expenses Chart */}
        <Card className="border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Comparativo Financeiro</CardTitle>
            <CardDescription>Receita vs Despesas</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Financeiro', receita: totalRevenue, despesa: totalExpenses }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: 'none', 
                    borderRadius: '1rem',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="receita" fill="#f5b10a" radius={[10, 10, 0, 0]} barSize={60} name="Receita" />
                <Bar dataKey="despesa" fill="#e11d48" radius={[10, 10, 0, 0]} barSize={60} name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Breakdown Card */}
        <Card className="border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Detalhamento de Operações</CardTitle>
            <CardDescription>Status das transações no período</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600">
                    <BarChartIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">Vendas Realizadas</p>
                    <p className="text-xs text-slate-500">{filteredSales.length} transações</p>
                  </div>
                </div>
                <span className="font-black text-emerald-600">{formatCurrency(totalRevenue)}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <PieChartIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">Despesas Pagas</p>
                    <p className="text-xs text-slate-500">{filteredExpenses.length} lançamentos</p>
                  </div>
                </div>
                <span className="font-black text-rose-600">-{formatCurrency(totalExpenses)}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">Comandas em Aberto</p>
                    <p className="text-xs text-slate-500">{comandas.filter(c => c.status === 'aberta').length} ativas</p>
                  </div>
                </div>
                <span className="font-black text-indigo-600">
                  {formatCurrency(comandas.filter(c => c.status === 'aberta').reduce((acc, curr) => acc + curr.items.reduce((a, b) => a + (b.price * b.quantity), 0), 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Transaction List - Only visible on print or detailed view */}
      <Card className="border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xl font-black uppercase tracking-tight">Histórico Detalhado</CardTitle>
          <CardDescription>Todas as movimentações do período selecionado</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Data</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredSales.map(s => ({ ...s, type: 'Venda' })), ...filteredExpenses.map(e => ({ ...e, type: 'Gasto', amount: -e.amount, product: e.description }))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50">
                    <td className="p-6 text-xs font-bold text-slate-500">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-6">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase",
                        item.type === 'Venda' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-700 dark:text-slate-300">{item.product}</td>
                    <td className={cn(
                      "p-6 text-sm font-black text-right",
                      item.type === 'Venda' ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {item.type === 'Venda' ? '+' : ''}{formatCurrency(item.amount * (item.quantity || 1))}
                    </td>
                  </tr>
                ))
              }
              {filteredSales.length === 0 && filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center opacity-30 font-bold">Nenhuma movimentação no período</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
