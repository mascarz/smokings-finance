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
  const [newNotinhaObs, setNewNotinhaObs] = useState("");

  const handleAddNotinha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotinhaName.trim()) return;
    addNotinha({ 
      customerName: newNotinhaName,
      observation: newNotinhaObs
    });
    setIsModalOpen(false);
    setNewNotinhaName("");
    setNewNotinhaObs("");
    toast("Notinha criada com sucesso!", "success");
  };

  const handleEditNotinha = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotinha) {
      updateNotinha(editingNotinha.id, { 
        customerName: editingNotinha.customerName,
        observation: editingNotinha.observation
      });
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
    <div className="space-y-6 md:space-y-10 animate-in relative pb-20 md:pb-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-rose-600">
            <FileText size={10} className="md:size-[12px]" />
            Controle de Fiados
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">Sistema de <span className="text-rose-500">Notinhas</span></h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Gerencie as pendências de clientes com total organização.</p>
        </div>
        <Button 
          variant="premium" 
          size="lg"
          className="hidden md:flex rounded-2xl px-8 shadow-xl bg-slate-950 text-white group h-14"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Nova Notinha
        </Button>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-rose-600 text-white shadow-2xl shadow-rose-500/40 z-40 flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <Card className="premium-card border-none bg-rose-500 text-white overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-1 md:mb-2">Pendente</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter truncate">{formatCurrency(pendingTotal).replace(",00", "")}</h3>
          </CardContent>
        </Card>
        <Card className="premium-card border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2">Em Aberto</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white truncate">
              {notinhas.filter(n => n.status === 'pendente').length}
            </h3>
          </CardContent>
        </Card>
        <Card className="premium-card border-none bg-emerald-500 text-white overflow-hidden col-span-2 sm:col-span-1">
          <CardContent className="p-4 md:p-8">
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-1 md:mb-2">Total Recebido</p>
            <h3 className="text-xl md:text-4xl font-black tracking-tighter truncate">{formatCurrency(receivedTotal).replace(",00", "")}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar cliente..." 
            className="pl-10 md:pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="lg" className="h-12 md:h-14 rounded-xl md:rounded-2xl px-3 md:px-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Filter size={18} className="md:mr-2 text-slate-400" />
          <span className="hidden md:inline">Filtros</span>
        </Button>
      </div>

      {/* Notinhas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredNotinhas.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-12 md:py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/20"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FileText size={32} className="text-slate-300 dark:text-slate-600 md:size-[40px]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 md:mb-2">Nenhuma notinha</h3>
              <p className="text-xs md:text-sm text-slate-500 max-w-[200px] md:max-w-xs mx-auto">Registre as vendas pendentes para melhor controle.</p>
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
                  "premium-card border-none group overflow-hidden h-full flex flex-col transition-all duration-500 min-h-[320px]",
                  n.status === 'pago' ? 'opacity-50 grayscale hover:grayscale-0' : ''
                )}>
                  <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transition-transform",
                          n.status === 'pendente' ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-emerald-500 text-white shadow-emerald-500/20"
                        )}>
                          <User size={20} className="md:size-[24px]" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-lg md:text-xl font-black tracking-tight truncate max-w-[100px] md:max-w-none">{n.customerName}</CardTitle>
                          <div className="flex items-center gap-1 text-slate-400">
                            <CalendarIcon size={10} className="md:size-[12px]" />
                            <CardDescription className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
                              {new Date(n.date).toLocaleDateString('pt-BR')}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest",
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
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 transition-all"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 md:p-6 pt-0 flex-1 flex flex-col gap-4 md:gap-6">
                    {n.observation && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30">
                        <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 mb-1">Observação:</p>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{n.observation}</p>
                      </div>
                    )}
                    <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto max-h-[120px] md:max-h-[150px] pr-1 custom-scrollbar">
                      {n.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 md:py-8 opacity-30">
                          <ShoppingBag size={20} className="mb-1.5 md:size-[24px]" />
                          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-center">Nenhum item</p>
                        </div>
                      ) : (
                        n.items.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <div className="flex-1 min-w-0 mr-2">
                              <p className="font-bold text-xs md:text-sm tracking-tight truncate">{item.name}</p>
                              <p className="text-[8px] md:text-[10px] font-black text-rose-600 uppercase tracking-widest">{formatCurrency(item.price).replace(",00", "")}</p>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-slate-900 p-1 md:p-1.5 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                              {n.status === 'pendente' && (
                                <button 
                                  onClick={() => updateNotinhaItem(n.id, item.productId, item.quantity - 1)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                                >
                                  <MinusCircle size={16} className="md:size-[18px]" />
                                </button>
                              )}
                              <span className="text-xs md:text-sm font-black w-3 md:w-4 text-center">{item.quantity}</span>
                              {n.status === 'pendente' && (
                                <button 
                                  onClick={() => updateNotinhaItem(n.id, item.productId, item.quantity + 1)}
                                  className="text-slate-400 hover:text-emerald-500 transition-colors p-0.5"
                                >
                                  <PlusCircle size={16} className="md:size-[18px]" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-4 md:pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</span>
                        <span className="text-xl md:text-3xl font-black tracking-tighter text-rose-600 dark:text-rose-500">
                          {formatCurrency(calculateTotal(n.items)).replace(",00", "")}
                        </span>
                      </div>
                      
                      {n.status === 'pendente' && (
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                          <Button 
                            variant="outline" 
                            size="lg"
                            className="rounded-xl md:rounded-2xl h-11 md:h-14 font-bold text-xs md:text-base border-slate-200 dark:border-slate-800"
                            onClick={() => {
                              setSelectedNotinha(n);
                              setIsItemsModalOpen(true);
                            }}
                          >
                            <Plus size={16} className="mr-1.5 md:mr-2" />
                            Itens
                          </Button>
                          <Button 
                            variant="premium" 
                            size="lg"
                            className="rounded-xl md:rounded-2xl h-11 md:h-14 font-bold text-xs md:text-base bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 border-none"
                            onClick={() => handlePay(n.id, n.customerName)}
                            disabled={n.items.length === 0}
                          >
                            <CheckCircle2 size={16} className="mr-1.5 md:mr-2" />
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
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Observação (Opcional)</label>
            <textarea 
              placeholder="Ex: Cliente vai pagar dia 20, ou detalhes sobre o fiado..." 
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm min-h-[100px] resize-none"
              value={newNotinhaObs}
              onChange={(e) => setNewNotinhaObs(e.target.value)}
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
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nova Observação</label>
              <textarea 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm min-h-[100px] resize-none"
                value={editingNotinha.observation || ""}
                onChange={(e) => setEditingNotinha({...editingNotinha, observation: e.target.value})}
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
