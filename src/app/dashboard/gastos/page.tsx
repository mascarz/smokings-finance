"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Tag, 
  DollarSign, 
  ArrowDownCircle,
  Filter,
  MoreHorizontal,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, cn, filterByDateRange } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

import { useApp } from "@/lib/context";

export default function GastosPage() {
  const { expenses, addExpense } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState<number | 'today' | 'all'>(30);

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    vendor: "",
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const activeCategories = Array.from(new Set(expenses.map(e => e.category)));
  const [categories, setCategories] = useState(activeCategories.length > 0 ? activeCategories : ["Estoque", "Infraestrutura", "Contas Fixas", "Marketing"]);

  // Atualizar categorias quando as despesas mudarem
  React.useEffect(() => {
    const currentCats = Array.from(new Set(expenses.map(e => e.category)));
    setCategories(prev => Array.from(new Set([...prev, ...currentCats])));
  }, [expenses]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewExpense({ ...newExpense, category: newCategoryName.trim() });
      setNewCategoryName("");
      setIsAddingCategory(false);
      toast("Nova categoria adicionada!");
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseToAdd = {
      ...newExpense,
      id: (expenses.length + 1).toString(),
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString(),
      status: "Pago",
    };
    addExpense(expenseToAdd);
    setIsModalOpen(false);
    setNewExpense({ description: "", amount: "", category: "", vendor: "" });
    toast("Despesa registrada com sucesso!");
  };

  const filteredByDate = dateFilter === 'all' ? expenses : filterByDateRange(expenses, dateFilter);

  const filteredExpenses = filteredByDate.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = filteredExpenses.filter(e => e.status === "Pendente").reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 md:space-y-10 animate-in relative pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-rose-600">
            <DollarSign size={10} className="md:size-[12px]" />
            Saídas de Caixa
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">Controle de <span className="text-rose-600">Gastos</span></h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Gerencie todas as saídas e despesas do seu negócio.</p>
        </div>
        <Button 
          variant="premium" 
          size="lg"
          className="hidden md:flex rounded-2xl px-8 shadow-xl bg-slate-950 text-white group h-14"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Registrar Gasto
        </Button>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-rose-600 text-white shadow-2xl shadow-rose-500/40 z-40 flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card className="premium-card border-none bg-rose-600 text-white shadow-xl shadow-rose-500/20 overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-rose-100/70 mb-1 md:mb-2">Total de Gastos ({dateFilter === 'all' ? 'Total' : `${dateFilter} dias`})</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter truncate">{formatCurrency(totalAmount).replace(",00", "")}</h3>
          </CardContent>
        </Card>
        <Card className="premium-card border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2">Pendentes</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter text-rose-600 dark:text-rose-500 truncate">{formatCurrency(pendingAmount).replace(",00", "")}</h3>
          </CardContent>
        </Card>
        <Card className="premium-card border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden col-span-2 md:col-span-1">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2">Categorias Ativas</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white truncate">{activeCategories.length}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar despesa ou categoria..." 
            className="pl-10 md:pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Button 
            variant={dateFilter === 'today' ? 'premium' : 'outline'} 
            size="sm" 
            className="rounded-xl h-10 px-4 whitespace-nowrap"
            onClick={() => setDateFilter('today')}
          >
            Hoje
          </Button>
          <Button 
            variant={dateFilter === 7 ? 'premium' : 'outline'} 
            size="sm" 
            className="rounded-xl h-10 px-4 whitespace-nowrap"
            onClick={() => setDateFilter(7)}
          >
            7 dias
          </Button>
          <Button 
            variant={dateFilter === 14 ? 'premium' : 'outline'} 
            size="sm" 
            className="rounded-xl h-10 px-4 whitespace-nowrap"
            onClick={() => setDateFilter(14)}
          >
            14 dias
          </Button>
          <Button 
            variant={dateFilter === 30 ? 'premium' : 'outline'} 
            size="sm" 
            className="rounded-xl h-10 px-4 whitespace-nowrap"
            onClick={() => setDateFilter(30)}
          >
            30 dias
          </Button>
          <Button 
            variant={dateFilter === 'all' ? 'premium' : 'outline'} 
            size="sm" 
            className="rounded-xl h-10 px-4 whitespace-nowrap"
            onClick={() => setDateFilter('all')}
          >
            Tudo
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Descrição</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Categoria</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Data</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Valor</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Status</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="border-b border-border hover:bg-secondary/10 transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{exp.description}</span>
                      <span className="text-xs text-muted-foreground">{exp.vendor}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md bg-secondary text-[10px] font-bold uppercase">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(exp.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 font-bold text-sm text-rose-500">
                    -{formatCurrency(exp.amount)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      exp.status === "Pago" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => toast("Visualizando comprovante...", "info")}
                      >
                        <FileText size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreHorizontal size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Novo Gasto"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Descrição da Despesa</label>
            <Input 
              required 
              placeholder="Ex: Reposição de Estoque" 
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Valor (R$)</label>
              <Input 
                required 
                type="number" 
                step="0.01"
                placeholder="0,00" 
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Categoria</label>
              <select 
                className="w-full h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              >
                <option value="Estoque">Estoque</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Contas Fixas">Contas Fixas</option>
                <option value="Marketing">Marketing</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Fornecedor / Local</label>
            <Input 
              required 
              placeholder="Ex: Distribuidora VIP" 
              value={newExpense.vendor}
              onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1">
              Registrar Gasto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
