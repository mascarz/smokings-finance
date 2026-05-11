"use client";

import React, { useState } from "react";
import { Plus, Search, ShoppingBag, DollarSign, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency } from "@/lib/utils";

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
    toast("Venda registrada com sucesso!");
  };

  const filteredSales = sales.filter(sale => 
    sale.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);

  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Controle de Vendas</h1>
          <p className="text-sm md:text-base text-muted-foreground">Registre seus produtos vendidos e acompanhe o faturamento real.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2 w-full md:w-auto justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Nova Venda
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-emerald-500/5 border-emerald-500/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-emerald-600 font-bold uppercase text-[10px]">Faturamento Total</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-primary/60 font-bold uppercase text-[10px]">Total de Itens Vendidos</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">{sales.reduce((acc, curr) => acc + curr.quantity, 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-secondary/50 border-border sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-muted-foreground font-bold uppercase text-[10px]">Vendas Registradas</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">{sales.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar por produto..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela Responsiva / Cards em Mobile */}
      <div className="block md:hidden space-y-4">
        {filteredSales.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
            Nenhuma venda registrada ainda.
          </div>
        ) : (
          filteredSales.map((sale) => (
            <Card key={sale.id} className="border-border overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{sale.product}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(sale.date).toLocaleString('pt-BR')}</p>
                  </div>
                  <span className="font-bold text-emerald-500">{formatCurrency(sale.amount * sale.quantity)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Qtd: {sale.quantity}x</span>
                  <span className="text-muted-foreground">Preço: {formatCurrency(sale.amount)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="hidden md:block border-none shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Produto</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Qtd</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Preço Unit.</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Total</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhuma venda registrada ainda.</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-border hover:bg-secondary/10 transition-colors">
                    <td className="p-4 font-bold text-sm">{sale.product}</td>
                    <td className="p-4 text-sm">{sale.quantity}x</td>
                    <td className="p-4 text-sm">{formatCurrency(sale.amount)}</td>
                    <td className="p-4 font-bold text-sm text-emerald-500">{formatCurrency(sale.amount * sale.quantity)}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(sale.date).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nova Venda"
      >
        <form onSubmit={handleAddSale} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Nome do Produto</label>
            <Input 
              required 
              placeholder="Ex: Essência Zomo Strong Mint" 
              value={newSale.product}
              onChange={(e) => setNewSale({...newSale, product: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Preço Unitário (R$)</label>
              <Input 
                required 
                type="number" 
                step="0.01"
                placeholder="0,00" 
                value={newSale.amount}
                onChange={(e) => setNewSale({...newSale, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Quantidade</label>
              <Input 
                required 
                type="number" 
                min="1"
                value={newSale.quantity}
                onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1">
              Finalizar Venda
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
