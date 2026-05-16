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
import { formatCurrency, cn, filterByDateRange } from "@/lib/utils";
import { exportToExcel } from "@/lib/export-utils";

export default function VendasPage() {
  const { sales, addSale, products } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<number | 'today' | 'all'>(30);

  // Sistema de Carrinho
  const [cart, setCart] = useState<any[]>([]);

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast("Adicione pelo menos um produto ao carrinho.", "warning");
      return;
    }
    
    // Salvar todos os itens do carrinho como vendas individuais
    cart.forEach(item => {
      addSale({
        product: item.product,
        amount: item.amount,
        quantity: item.quantity,
      });
    });

    setIsModalOpen(false);
    setCart([]);
    toast(`${cart.length} vendas registradas com sucesso!`, "success");
  };

  const handleSelectProduct = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        product: product.name,
        amount: product.price,
        quantity: 1
      }]);
    }
    setIsProductModalOpen(false);
    toast(`${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleExportExcel = () => {
    if (sales.length === 0) {
      toast("Não há vendas para exportar.", "warning");
      return;
    }
    const dataToExport = sales.map(s => ({
      Produto: s.product,
      Quantidade: s.quantity,
      'Preço Unitário': formatCurrency(s.amount),
      Total: formatCurrency(s.amount * s.quantity),
      Data: new Date(s.date).toLocaleString('pt-BR')
    }));
    exportToExcel("Historico_de_Vendas_Smokings", dataToExport);
    toast("Histórico exportado com sucesso!");
  };

  const filteredByDate = dateFilter === 'all' ? sales : filterByDateRange(sales, dateFilter);

  const filteredSales = filteredByDate.filter(sale => 
    sale.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredSales.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
  const totalItems = filteredSales.reduce((acc, curr) => acc + curr.quantity, 0);

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
          <Button variant="outline" size="lg" className="rounded-2xl px-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm h-14" onClick={handleExportExcel}>
            <Download size={18} className="mr-2 text-slate-400" />
            Excel
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
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/70 mb-1 md:mb-2">Faturamento ({dateFilter === 'all' ? 'Total' : `${dateFilter} dias`})</p>
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
            <h3 className="text-xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white truncate">{filteredSales.length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar venda..." 
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

      {/* New Sale Modal - Multi-item Cart UI */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Venda (Múltiplos Itens)"
      >
        <div className="space-y-6 p-2">
          <div className="flex justify-between items-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carrinho de Vendas</p>
            <Button 
              type="button" 
              variant="gold" 
              size="sm" 
              className="h-10 rounded-xl px-4"
              onClick={() => setIsProductModalOpen(true)}
            >
              <Plus size={16} className="mr-2" />
              Adicionar Produto
            </Button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl opacity-40">
                <ShoppingBag size={40} className="mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Carrinho vazio</p>
                <p className="text-[10px] font-medium mt-1">Clique em "Adicionar Produto" para começar.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-bold text-sm tracking-tight truncate">{item.product}</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      {formatCurrency(item.amount)} un.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <button 
                        onClick={() => updateCartQuantity(item.productId, -1)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 size={14} className={cn(item.quantity === 1 && "text-rose-500")} />
                      </button>
                      <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.productId, 1)}
                        className="text-slate-400 hover:text-emerald-500 transition-colors p-1"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-black text-xs min-w-[60px] text-right">
                      {formatCurrency(item.amount * item.quantity).replace(",00", "")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Total da Venda</span>
                <span className="text-2xl font-black tracking-tighter text-emerald-600">
                  {formatCurrency(cartTotal)}
                </span>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-14 rounded-2xl font-bold" 
                  onClick={() => {
                    setCart([]);
                    setIsModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="premium" 
                  className="flex-1 h-14 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-500/20"
                  onClick={handleAddSale}
                >
                  Finalizar Venda
                </Button>
              </div>
            </div>
          )}
          
          {cart.length === 0 && (
            <Button variant="ghost" className="w-full h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          )}
        </div>
      </Modal>

      {/* Product Selection Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Selecionar Produto do Estoque"
      >
        <div className="space-y-6 p-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar no estoque..." 
              className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 opacity-40">
                <ShoppingBag size={40} className="mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Nenhum produto em estoque</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <button 
                  key={product.id}
                  type="button"
                  onClick={() => handleSelectProduct(product)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all group w-full text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors">
                      <ShoppingBag size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold tracking-tight">{product.name}</p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{product.category} • {formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-400 group-hover:text-emerald-500 transition-colors">
                    SELECIONAR
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold" onClick={() => setIsProductModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
