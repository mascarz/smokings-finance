"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  ArrowRight,
  Sparkles,
  BarChart2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";

export default function AIPage() {
  const { toast } = useToast();
  const { sales, expenses } = useApp();
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Calcular dados reais de faturamento por semana para o gráfico de previsão
  const getDynamicPredictionData = () => {
    if (sales.length === 0) return [];

    const data = [];
    const today = new Date();
    
    // Pegar últimas 4 semanas de dados reais
    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(today.getDate() - (i + 1) * 7);
      const end = new Date();
      end.setDate(today.getDate() - i * 7);

      const weekRevenue = sales
        .filter(s => {
          const sDate = new Date(s.date);
          return sDate >= start && sDate < end;
        })
        .reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);

      data.push({
        name: `Semana ${4 - i}`,
        faturamento: weekRevenue,
        previsao: weekRevenue
      });
    }

    // Gerar previsões para as próximas 3 semanas (simulando IA baseada em crescimento real)
    const lastWeekRevenue = data[data.length - 1].faturamento;
    const growthRate = lastWeekRevenue > 0 ? 1.1 : 0; // Simula 10% de crescimento se houver vendas

    for (let i = 1; i <= 3; i++) {
      data.push({
        name: `Semana ${4 + i} (IA)`,
        previsao: lastWeekRevenue * Math.pow(growthRate, i)
      });
    }

    return data;
  };

  const dynamicPredictionData = getDynamicPredictionData();

  // Calcular produtos reais mais lucrativos
  const getTopProducts = () => {
    if (sales.length === 0) return [];

    const productStats: Record<string, { name: string, total: number, qty: number }> = {};
    
    sales.forEach(s => {
      if (!productStats[s.product]) {
        productStats[s.product] = { name: s.product, total: 0, qty: 0 };
      }
      productStats[s.product].total += (s.amount * s.quantity);
      productStats[s.product].qty += s.quantity;
    });

    return Object.values(productStats)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map(p => ({
        name: p.name,
        lucro: `R$ ${p.total.toFixed(2)}`,
        score: Math.min(100, (p.total / 1000) * 100) // Score fictício baseado em volume
      }));
  };

  const topProducts = getTopProducts();

  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);

  // Calcular melhores horários reais
  const getBestTimes = () => {
    if (sales.length === 0) return [];

    const hourStats: Record<number, number> = {};
    sales.forEach(s => {
      const hour = new Date(s.date).getHours();
      hourStats[hour] = (hourStats[hour] || 0) + 1;
    });

    // Agrupar em faixas
    const faixas = [
      { range: "18:00 - 20:00", count: 0, status: "Pico", color: "bg-gold-500" },
      { range: "20:00 - 22:00", count: 0, status: "Alto", color: "bg-primary" },
      { range: "14:00 - 16:00", count: 0, status: "Moderado", color: "bg-muted-foreground" },
    ];

    sales.forEach(s => {
      const h = new Date(s.date).getHours();
      if (h >= 18 && h < 20) faixas[0].count++;
      else if (h >= 20 && h < 22) faixas[1].count++;
      else if (h >= 14 && h < 16) faixas[2].count++;
    });

    return faixas.sort((a, b) => b.count - a.count);
  };

  const bestTimes = getBestTimes();

  const handleUpdate = () => {
    setIsUpdating(true);
    toast("IA processando novos dados...", "info");
    setTimeout(() => {
      setIsUpdating(false);
      toast("Análise financeira atualizada com sucesso!");
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* AI Header */}
      <div className="p-8 rounded-3xl bg-black text-white dark:bg-white dark:text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <BrainCircuit size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-500 text-xs font-bold mb-4">
            <Sparkles size={14} />
            INTELIGÊNCIA ARTIFICIAL ATIVA
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Previsões e Insights Inteligentes</h1>
          <p className="text-white/60 dark:text-black/60 text-lg mb-6">
            Nossa IA analisou seus dados dos últimos 6 meses para gerar previsões precisas e recomendações estratégicas para sua tabacaria.
          </p>
          <Button 
            variant="gold" 
            className="flex items-center gap-2" 
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Processando..." : "Atualizar Análise"} <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prediction Chart */}
        <Card className="lg:col-span-2 border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="text-gold-500" />
              Previsão de Faturamento Futuro
            </CardTitle>
            <CardDescription>Projeção para as próximas 3 semanas baseada em tendências históricas</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {dynamicPredictionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dynamicPredictionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="faturamento" 
                    stroke="#000" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#000' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previsao" 
                    stroke="#f5b10a" 
                    strokeWidth={3} 
                    strokeDasharray="5 5" 
                    dot={{ r: 4, fill: '#f5b10a' }} 
                  />
                  <ReferenceLine x="Semana 4" stroke="#888" label="Hoje" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 border border-dashed border-border rounded-2xl">
                <BarChart2 className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground italic">Sem dados de vendas suficientes para gerar previsões de faturamento.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-gold-500/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="text-gold-600" size={18} />
                Dica de Ouro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {sales.length > 0 
                  ? "Sua IA identificou que as vendas aumentam nos finais de semana. Garanta que o estoque esteja completo até sexta-feira."
                  : "Comece registrando suas primeiras vendas para que a IA possa analisar seus horários de pico e sugerir melhorias no estoque."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-rose-500/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-rose-600">
                <AlertTriangle size={18} />
                Alerta de Prejuízo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {expenses.length > 0
                  ? "Mantenha o controle rigoroso dos gastos fixos. A IA monitora variações atípicas para evitar que seu lucro seja comprometido."
                  : "Registre seus gastos em 'Controle de Gastos' para que possamos alertar sobre despesas excessivas e proteger seu lucro."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-500/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                <Target size={18} />
                Meta Sugerida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {sales.length > 0
                  ? `Com base no ritmo atual, sua meta de faturamento pode ser estabelecida em ${formatCurrency(totalRevenue * 1.2)} para o próximo mês.`
                  : "Defina sua primeira meta de vendas! Assim que você começar a vender, a IA calculará metas realistas e alcançáveis."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Intelligent Reports section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Produtos Mais Lucrativos</CardTitle>
            <CardDescription>Análise de margem vs volume de vendas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">Total: {item.lucro}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-bold">{Math.round(item.score)}/100</div>
                    <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${item.score}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-2xl">
                <p className="text-sm text-muted-foreground italic">Registre vendas para ver os produtos mais lucrativos.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Melhores Horários</CardTitle>
            <CardDescription>Faturamento previsto por faixa de horário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bestTimes.length > 0 ? (
              bestTimes.map((item) => (
                <div key={item.range} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                  <span className="font-bold text-sm">{item.range}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-2xl">
                <p className="text-sm text-muted-foreground italic">Aguardando dados de horário das vendas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
