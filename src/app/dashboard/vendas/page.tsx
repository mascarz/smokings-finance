"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  Trash2, 
  ArrowUpRight,
  TrendingUp,
  Filter,
  Download,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency, cn } from "@/lib/utils";

export default function VendasPage() {
  const { sales, addSale } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newSale, setNewSale] = useState({
    product: "",
    amount: "",
    quantity: "1",
  });

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    addSale({
      product: newSale.product,
      amount: parseFloat(newSale.amount),
      quantity: parseInt(newSale.quantity),
    });
    setIsModalOpen(false);
    setNewSale({ product: "", amount: "", quantity: "1" });
    toast("Venda registrada com sucesso!", "success");
  };

  const filteredSales = sales.filter(sale => 
    sale.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
  const totalItems = sales.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="space-y-6 md:space-y-10 animate-in relative pb-20 md:pb-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-600">
            <CheckCircle2 size={10} className="md:size-[12px]" />
            Fluxo de Caixa
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">Histórico de <span className="text-emerald-600">Vendas</span></h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Monitore cada transação e o crescimento do seu faturamento.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <Button variant="outline" size="lg" className="rounded-2xl px-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm h-14">
            <Download size={18} className="mr-2 text-slate-400" />
            Exportar
          </Button>
          <Button 
            variant="premium" 
            size="lg"
            className="rounded-2xl px-8 shadow-xl bg-slate-950 text-white group h-14"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Nova Venda
          </Button>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40 z-40 flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card className="premium-card border-none bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/70 mb-1 md:mb-2">Faturamento</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter truncate">{formatCurrency(totalRevenue).replace(",00", "")}</h3>
          </CardContent>
        </Card>
        <Card className="premium-card border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2">Itens</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white truncate">{totalItems}</h3>
          </CardContent>
        </Card>
        <Card className="premium-card border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden col-span-2 md:col-span-1">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2">Transações</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white truncate">{sales.length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar venda..." 
            className="pl-10 md:pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="lg" className="h-12 md:h-14 rounded-xl md:rounded-2xl px-3 md:px-6 bg-white dark:bg-slate-900 shadow-sm">
          <Filter size={18} className="md:mr-2 text-slate-400" />
          <span className="hidden md:inline">Filtros</span>
        </Button>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block border-none premium-shadow bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Produto</th>
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Qtd</th>
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total</th>
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Data</th>
                <th className="p-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center opacity-30">Nenhuma venda registrada</td>
                  </tr>
                ) : (
                  filteredSales.map((sale, index) => (
                    <motion.tr 
                      key={sale.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3 font-bold tracking-tight">{sale.product}</div>
                      </td>
                      <td className="p-6 text-xs font-black text-slate-500">{sale.quantity}x</td>
                      <td className="p-6 font-black text-emerald-600">{formatCurrency(sale.amount * sale.quantity)}</td>
                      <td className="p-6 text-sm font-bold text-slate-700 dark:text-slate-300">
                        {new Date(sale.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-6">
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest w-fit">Confirmada</div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredSales.length === 0 ? (
          <div className="py-12 text-center opacity-30">Nenhuma venda registrada</div>
        ) : (
          filteredSales.map((sale) => (
            <Card key={sale.id} className="premium-card border-none p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <ShoppingBag size={16} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{sale.product}</span>
                </div>
                <span className="text-xs font-black text-emerald-600">{formatCurrency(sale.amount * sale.quantity).replace(",00", "")}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>{sale.quantity}x • {new Date(sale.date).toLocaleDateString('pt-BR')}</span>
                <span className="text-emerald-500">Confirmada</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* New Sale Modal - Premium UI */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Venda Direta"
      >
        <form onSubmit={handleAddSale} className="space-y-6 p-2">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome do Produto</label>
            <Input 
              required 
              placeholder="Ex: Essência Zomo Strong Mint" 
              className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20"
              value={newSale.product}
              onChange={(e) => setNewSale({...newSale, product: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço Unitário</label>
              <Input 
                required 
                type="number" 
                step="0.01"
                placeholder="0,00" 
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                value={newSale.amount}
                onChange={(e) => setNewSale({...newSale, amount: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantidade</label>
              <Input 
                required 
                type="number" 
                min="1"
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                value={newSale.quantity}
                onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1 h-14 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-500/20">
              Finalizar Venda
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
