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
import { formatCurrency } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

import { useApp } from "@/lib/context";

export default function GastosPage() {
  const { expenses: contextExpenses, addExpense } = useApp();
  const [expenses, setExpenses] = useState(contextExpenses.length > 0 ? contextExpenses : []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Sincronizar com context
  React.useEffect(() => {
    if (contextExpenses.length > 0) {
      setExpenses(contextExpenses);
    }
  }, [contextExpenses]);

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Estoque",
    vendor: "",
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (expenses.length + 1).toString();
    const expenseToAdd = {
      ...newExpense,
      id,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split('T')[0],
      status: "Pago",
    };
    addExpense(expenseToAdd);
    setExpenses([expenseToAdd, ...expenses]);
    setIsModalOpen(false);
    setNewExpense({ description: "", amount: "", category: "Estoque", vendor: "" });
    toast("Despesa registrada com sucesso!");
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = expenses.filter(e => e.status === "Pendente").reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Gastos</h1>
          <p className="text-muted-foreground">Gerencie todas as saídas e despesas do seu negócio.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Registrar Gasto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-rose-500/5 border-rose-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-rose-600 font-bold uppercase text-[10px]">Total de Gastos (Mês)</CardDescription>
            <CardTitle className="text-3xl font-bold text-rose-600">{formatCurrency(totalAmount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-600 font-bold uppercase text-[10px]">Pendentes de Pagamento</CardDescription>
            <CardTitle className="text-3xl font-bold text-amber-600">{formatCurrency(pendingAmount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary/60 font-bold uppercase text-[10px]">Categorias Ativas</CardDescription>
            <CardTitle className="text-3xl font-bold">12</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar despesa, categoria ou fornecedor..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => toast("Filtros avançados em breve!", "info")}
        >
          <Filter size={18} /> Filtros Avançados
        </Button>
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
