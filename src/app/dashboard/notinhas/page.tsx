"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  User, 
  Edit, 
  Package, 
  ChevronRight,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  ShoppingBag,
  Filter,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency, cn } from "@/lib/utils";

export default function NotinhasPage() {
  const { products, notinhas, addNotinha, addItemToNotinha, updateNotinhaItem, payNotinha, updateNotinha } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedNotinha, setSelectedNotinha] = useState<any>(null);
  const [editingNotinha, setEditingNotinha] = useState<any>(null);

  const [newNotinhaName, setNewNotinhaName] = useState("");

  const handleAddNotinha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotinhaName.trim()) return;
    addNotinha({ customerName: newNotinhaName });
    setIsModalOpen(false);
    setNewNotinhaName("");
    toast("Notinha criada com sucesso!", "success");
  };

  const handleEditNotinha = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotinha) {
      updateNotinha(editingNotinha.id, { customerName: editingNotinha.customerName });
      setIsEditModalOpen(false);
      setEditingNotinha(null);
      toast("Notinha atualizada!");
    }
  };

  const handleAddItem = (notinhaId: string, product: any) => {
    addItemToNotinha(notinhaId, {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    toast(`${product.name} adicionado!`);
  };

  const handlePay = (id: string, customerName: string) => {
    if (confirm(`Confirmar pagamento da notinha de ${customerName}? O valor será adicionado ao faturamento.`)) {
      payNotinha(id);
      toast(`Notinha de ${customerName} paga e faturada!`);
    }
  };

  const calculateTotal = (items: any[]) => {
    return items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  };

  const filteredNotinhas = notinhas.filter(n => 
    n.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const pendingTotal = notinhas
    .filter(n => n.status === 'pendente')
    .reduce((acc, curr) => acc + calculateTotal(curr.items), 0);

  const receivedTotal = notinhas
    .filter(n => n.status === 'pago')
    .reduce((acc, curr) => acc + calculateTotal(curr.items), 0);

  return (
    <div className="space-y-10 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest text-rose-600">
            <FileText size={12} />
            Controle de Fiados
          </div>
          <h1 className="text-4xl font-black tracking-tight">Sistema de <span className="text-rose-500">Notinhas</span></h1>
          <p className="text-slate-500 font-medium">Gerencie as pendências de clientes com total organização.</p>
        </div>
        <Button 
          variant="premium" 
          size="lg"
          className="rounded-2xl px-8 shadow-xl bg-slate-950 text-white group"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Nova Notinha
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="premium-card border-none bg-rose-500 text-white">
          <CardContent className="p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-2">Total Pendente</p>
            <h3 className="text-4xl font-black tracking-tighter">{formatCurrency(pendingTotal)}</h3>
            <div className="mt-4 flex items-center gap-2 text-rose-100 text-xs font-bold">
              <Clock size={14} />
              Aguardando recebimento
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-none bg-white dark:bg-slate-900 shadow-xl">
          <CardContent className="p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Notinhas em Aberto</p>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
              {notinhas.filter(n => n.status === 'pendente').length}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs font-bold">
              <CalendarIcon size={14} />
              Ativas no momento
            </div>
          </CardContent>
        </Card>
        <Card className="premium-card border-none bg-emerald-500 text-white">
          <CardContent className="p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-2">Total Recebido</p>
            <h3 className="text-4xl font-black tracking-tighter">{formatCurrency(receivedTotal)}</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-100 text-xs font-bold">
              <CheckCircle2 size={14} />
              Já faturado
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Buscar por nome do cliente..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="lg" className="h-14 rounded-2xl px-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Filter size={18} className="mr-2 text-slate-400" />
          Filtros
        </Button>
      </div>

      {/* Notinhas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredNotinhas.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/20"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText size={40} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Nenhuma notinha</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Registre as vendas pendentes para melhor controle.</p>
            </motion.div>
          ) : (
            filteredNotinhas.map((n, index) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={cn(
                  "premium-card border-none group overflow-hidden h-full flex flex-col transition-all duration-500",
                  n.status === 'pago' ? 'opacity-50 grayscale hover:grayscale-0' : ''
                )}>
                  <CardHeader className="p-6 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                          n.status === 'pendente' ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-emerald-500 text-white shadow-emerald-500/20"
                        )}>
                          <User size={24} />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-black tracking-tight">{n.customerName}</CardTitle>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <CalendarIcon size={12} />
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                              {new Date(n.date).toLocaleDateString('pt-BR')}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          n.status === 'pendente' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                        )}>
                          {n.status}
                        </div>
                        {n.status === 'pendente' && (
                          <button 
                            onClick={() => {
                              setEditingNotinha(n);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 flex-1 flex flex-col gap-6">
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                      {n.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 opacity-40">
                          <ShoppingBag size={24} className="mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-center">Nenhum item<br />registrado</p>
                        </div>
                      ) : (
                        n.items.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <div className="flex-1">
                              <p className="font-bold text-sm tracking-tight">{item.name}</p>
                              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{formatCurrency(item.price)} cada</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                              {n.status === 'pendente' && (
                                <button 
                                  onClick={() => updateNotinhaItem(n.id, item.productId, item.quantity - 1)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                  <MinusCircle size={18} />
                                </button>
                              )}
                              <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                              {n.status === 'pendente' && (
                                <button 
                                  onClick={() => updateNotinhaItem(n.id, item.productId, item.quantity + 1)}
                                  className="text-slate-400 hover:text-emerald-500 transition-colors"
                                >
                                  <PlusCircle size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Total Pendente</span>
                        <span className="text-3xl font-black tracking-tighter text-rose-600 dark:text-rose-500">
                          {formatCurrency(calculateTotal(n.items))}
                        </span>
                      </div>
                      
                      {n.status === 'pendente' && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            size="lg"
                            className="rounded-2xl h-14 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                            onClick={() => {
                              setSelectedNotinha(n);
                              setIsItemsModalOpen(true);
                            }}
                          >
                            <Plus size={18} className="mr-2" />
                            Itens
                          </Button>
                          <Button 
                            variant="premium" 
                            size="lg"
                            className="rounded-2xl h-14 font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 border-none"
                            onClick={() => handlePay(n.id, n.customerName)}
                            disabled={n.items.length === 0}
                          >
                            <CheckCircle2 size={18} className="mr-2" />
                            Pagar
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals - Same high-quality UI as Comandas */}
      {/* Modal Nova Notinha */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Notinha"
      >
        <form onSubmit={handleAddNotinha} className="space-y-6 p-2">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome do Cliente</label>
            <Input 
              required 
              placeholder="Ex: Carlos Andrade" 
              className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-rose-500/20"
              value={newNotinhaName}
              onChange={(e) => setNewNotinhaName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1 h-14 rounded-2xl font-bold bg-slate-950 text-white">
              Criar Agora
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Notinha */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cliente"
      >
        {editingNotinha && (
          <form onSubmit={handleEditNotinha} className="space-y-6 p-2">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome Atualizado</label>
              <Input 
                required 
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                value={editingNotinha.customerName}
                onChange={(e) => setEditingNotinha({...editingNotinha, customerName: e.target.value})}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="premium" className="flex-1 h-14 rounded-2xl font-bold bg-slate-950 text-white">
                Salvar
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Adicionar Itens à Notinha */}
      <Modal
        isOpen={isItemsModalOpen}
        onClose={() => setIsItemsModalOpen(false)}
        title={`Notinha: ${selectedNotinha?.customerName}`}
      >
        <div className="space-y-6 p-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar no catálogo..." 
              className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 opacity-40">
                <ShoppingBag size={40} className="mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Nenhum produto encontrado</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-rose-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-rose-500 group-hover:border-rose-500 transition-colors">
                      <ShoppingBag size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold tracking-tight">{product.name}</p>
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{product.category} • {formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <Button 
                    variant="premium" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl bg-slate-950 text-white"
                    onClick={() => handleAddItem(selectedNotinha.id, product)}
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold" onClick={() => setIsItemsModalOpen(false)}>
              Concluir Notinha
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
