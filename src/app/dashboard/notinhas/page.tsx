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
  Trash2,
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
  const { products, notinhas, addNotinha, addItemToNotinha, updateNotinhaItem, payNotinha, updateNotinha, deleteNotinha } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedNotinha, setSelectedNotinha] = useState<any>(null);
  const [editingNotinha, setEditingNotinha] = useState<any>(null);
  const [payDiscount, setPayDiscount] = useState("0");

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

  const handleOpenPay = (notinha: any) => {
    setSelectedNotinha(notinha);
    setPayDiscount("0");
    setIsPayModalOpen(true);
  };

  const handleConfirmPay = () => {
    if (selectedNotinha) {
      payNotinha(selectedNotinha.id, parseFloat(payDiscount) || 0);
      setIsPayModalOpen(false);
      setSelectedNotinha(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notinha permanentemente?")) {
      deleteNotinha(id);
      toast("Notinha removida.");
    }
  };

  const calculateTotal = (items: any[]) => {
    return (items || []).reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  };

  const filteredNotinhas = (notinhas || []).filter(n => 
    n && n.customerName && n.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = (products || []).filter(p => 
    p && p.name && p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const pendingTotal = (notinhas || [])
    .filter(n => n && n.status === 'pendente')
    .reduce((acc, curr) => acc + calculateTotal(curr.items || []), 0);

  const receivedTotal = (notinhas || [])
    .filter(n => n && n.status === 'pago')
    .reduce((acc, curr) => acc + calculateTotal(curr.items || []), 0);

  return (
    <div className="space-y-8 md:space-y-12 animate-in relative pb-20 md:pb-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <FileText size={12} />
            Gestão de Recebíveis
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">Sistema de <span className="text-gold-500">Notinhas</span></h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl">
            Controle total sobre pendências de clientes e fluxo de caixa futuro com organização profissional.
          </p>
        </div>
        <Button 
          variant="premium" 
          size="lg"
          className="hidden md:flex rounded-xl px-8 shadow-xl bg-primary text-primary-foreground group h-14 font-bold border-none"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Nova Notinha
        </Button>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl z-40 flex items-center justify-center active:scale-95 transition-transform border-4 border-background"
      >
        <Plus size={28} />
      </button>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card className="premium-card bg-amber-500/5 border-amber-500/10">
          <CardContent className="p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Total Pendente</p>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight text-amber-700">{formatCurrency(pendingTotal).replace(",00", "")}</h3>
          </CardContent>
        </Card>
        <Card className="premium-card">
          <CardContent className="p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Contas em Aberto</p>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
              {(notinhas || []).filter(n => n && n.status === 'pendente').length}
            </h3>
          </CardContent>
        </Card>
        <Card className="premium-card bg-emerald-500/5 border-emerald-500/10">
          <CardContent className="p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Total Recebido</p>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight text-emerald-700">{formatCurrency(receivedTotal).replace(",00", "")}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Pesquisar por nome do cliente..." 
            className="pl-12 h-14 rounded-xl bg-card border-border shadow-sm text-sm md:text-base focus:ring-primary/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="lg" className="h-14 rounded-xl px-4 md:px-6 border-border bg-card shadow-sm font-bold text-xs uppercase tracking-widest">
          <Filter size={18} className="md:mr-2" />
          <span className="hidden md:inline">Filtrar</span>
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
                  "premium-card group overflow-hidden h-full flex flex-col transition-all duration-300 min-h-[350px]",
                  n.status === 'pago' ? 'opacity-60 grayscale-[50%] hover:grayscale-0' : ''
                )}>
                  <CardHeader className="p-6 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-current/10 transition-transform",
                          n.status === 'pendente' ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                        )}>
                          <User size={24} />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-xl font-bold tracking-tight truncate max-w-[150px]">{n.customerName}</CardTitle>
                          <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                            <CalendarIcon size={12} />
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                              {new Date(n.date).toLocaleDateString('pt-BR')}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={cn(
                          "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-current/20",
                          n.status === 'pendente' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                        )}>
                          {n.status}
                        </div>
                        {n.status === 'pendente' && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingNotinha(n);
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(n.id)}
                              className="p-2 rounded-lg hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 flex-1 flex flex-col gap-6">
                    {n.observation && (
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Observação</p>
                        <p className="text-xs font-medium text-foreground/80 leading-relaxed">{n.observation}</p>
                      </div>
                    )}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[180px] pr-1 custom-scrollbar">
                      {(!n.items || n.items.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-20">
                          <ShoppingBag size={24} className="mb-2" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-center">Nenhum item</p>
                        </div>
                      ) : (
                        n.items.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/50">
                            <div className="flex-1 min-w-0 mr-3">
                              <p className="font-bold text-sm tracking-tight truncate">{item.name}</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{formatCurrency(item.price).replace(",00", "")}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-card px-2 py-1.5 rounded-lg border border-border shadow-sm">
                              {n.status === 'pendente' && (
                                <button 
                                  onClick={() => updateNotinhaItem(n.id, item.productId, item.quantity - 1)}
                                  className="text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <MinusCircle size={16} />
                                </button>
                              )}
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              {n.status === 'pendente' && (
                                <button 
                                  onClick={() => updateNotinhaItem(n.id, item.productId, item.quantity + 1)}
                                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                                >
                                  <PlusCircle size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-6 border-t border-border mt-auto">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Saldo Total</span>
                        <span className="text-3xl font-black tracking-tight text-foreground">
                          {formatCurrency(calculateTotal(n.items)).replace(",00", "")}
                        </span>
                      </div>
                      
                      {n.status === 'pendente' && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            size="lg"
                            className="rounded-xl h-14 font-bold text-xs uppercase tracking-widest border-border bg-card shadow-sm"
                            onClick={() => {
                              setSelectedNotinha(n);
                              setIsItemsModalOpen(true);
                            }}
                          >
                            <Plus size={16} className="mr-2" />
                            Itens
                          </Button>
                          <Button 
                            variant="premium" 
                            size="lg"
                            className="rounded-xl h-14 font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/10 border-none"
                            onClick={() => handleOpenPay(n)}
                            disabled={n.items.length === 0}
                          >
                            <CheckCircle2 size={16} className="mr-2" />
                            Liquidar
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

      {/* Modal Pagamento com Desconto */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={`Receber de: ${selectedNotinha?.customerName}`}
      >
        <div className="space-y-6 p-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Fiado</span>
              <span className="font-bold">{formatCurrency(calculateTotal(selectedNotinha?.items || []))}</span>
            </div>
            <div className="flex justify-between items-center text-rose-600">
              <span className="text-xs font-black uppercase tracking-widest">Valor Final</span>
              <span className="text-2xl font-black">
                {formatCurrency(calculateTotal(selectedNotinha?.items || []) - (parseFloat(payDiscount) || 0))}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Abatimento / Desconto (R$)</label>
            <Input 
              type="number" 
              step="0.01"
              placeholder="0,00" 
              className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-rose-500/20"
              value={payDiscount}
              onChange={(e) => setPayDiscount(e.target.value)}
            />
            <p className="text-[10px] text-slate-500 font-medium italic">O desconto será subtraído do total da notinha ao finalizar.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsPayModalOpen(false)}>
              Voltar
            </Button>
            <Button variant="premium" className="flex-1 h-14 rounded-2xl font-bold bg-rose-600 hover:bg-rose-700 text-white" onClick={handleConfirmPay}>
              Confirmar Recebimento
            </Button>
          </div>
        </div>
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
