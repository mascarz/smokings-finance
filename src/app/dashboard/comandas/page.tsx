"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  ClipboardList, 
  Trash2, 
  PlusCircle, 
  MinusCircle, 
  CheckCircle, 
  User, 
  ShoppingBag,
  Edit,
  MoreVertical,
  X,
  Clock,
  ArrowRight,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency, cn } from "@/lib/utils";

export default function ComandasPage() {
  const { products, comandas, addComanda, addItemToComanda, updateComandaItem, payComanda, updateComanda } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [selectedComanda, setSelectedComanda] = useState<any>(null);
  const [editingComanda, setEditingComanda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [newComandaName, setNewComandaName] = useState("");

  const handleCreateComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComandaName.trim()) return;
    addComanda({ customerName: newComandaName });
    setIsModalOpen(false);
    setNewComandaName("");
    toast("Comanda aberta com sucesso!", "success");
  };

  const handleEditComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComanda) {
      updateComanda(editingComanda.id, { customerName: editingComanda.customerName });
      setIsEditModalOpen(false);
      setEditingComanda(null);
      toast("Comanda atualizada!");
    }
  };

  const handleAddItem = (comandaId: string, product: any) => {
    addItemToComanda(comandaId, {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    toast(`${product.name} adicionado!`);
  };

  const handlePay = (id: string) => {
    if (confirm("Deseja finalizar e pagar esta comanda? O valor será adicionado ao faturamento.")) {
      payComanda(id);
      toast("Comanda paga e faturada!");
    }
  };

  const filteredComandas = comandas.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) && c.status === 'aberta'
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const calculateTotal = (items: any[]) => {
    return items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  };

  return (
    <div className="space-y-10 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-[10px] font-bold uppercase tracking-widest text-gold-600">
            <ClipboardList size={12} />
            Gestão de Mesas
          </div>
          <h1 className="text-4xl font-black tracking-tight">Comandas <span className="text-gold-500">Ativas</span></h1>
          <p className="text-slate-500 font-medium">Controle o consumo em tempo real com precisão.</p>
        </div>
        <Button 
          variant="gold" 
          size="lg"
          className="rounded-2xl px-8 shadow-xl shadow-gold-500/20 group"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Abrir Nova Comanda
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Buscar comanda por nome ou mesa..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm focus:ring-gold-500/20 focus:border-gold-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="lg" className="h-14 rounded-2xl px-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Filter size={18} className="mr-2 text-slate-400" />
          Filtros
        </Button>
      </div>

      {/* Comandas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredComandas.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/20"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ClipboardList size={40} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Nenhuma comanda aberta</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Comece abrindo uma nova comanda para seus clientes.</p>
            </motion.div>
          ) : (
            filteredComandas.map((comanda, index) => (
              <motion.div
                key={comanda.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="premium-card border-none group overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                  
                  <CardHeader className="relative p-6 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 dark:bg-white flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-black/20 group-hover:scale-110 transition-transform">
                          <User size={24} className="text-white dark:text-slate-950" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-black tracking-tight">{comanda.customerName}</CardTitle>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock size={12} />
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                              Início: {new Date(comanda.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setEditingComanda(comanda);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative p-6 pt-0 flex-1 flex flex-col gap-6">
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                      {comanda.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 opacity-40">
                          <ShoppingBag size={32} className="mb-2" />
                          <p className="text-xs font-bold uppercase tracking-widest">Aguardando pedidos</p>
                        </div>
                      ) : (
                        comanda.items.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group/item">
                            <div className="flex-1">
                              <p className="font-bold text-sm tracking-tight">{item.name}</p>
                              <p className="text-[10px] font-black text-gold-600 uppercase tracking-widest">{formatCurrency(item.price)}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                              <button 
                                onClick={() => updateComandaItem(comanda.id, item.productId, item.quantity - 1)}
                                className="text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <MinusCircle size={18} />
                              </button>
                              <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateComandaItem(comanda.id, item.productId, item.quantity + 1)}
                                className="text-slate-400 hover:text-emerald-500 transition-colors"
                              >
                                <PlusCircle size={18} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Total Acumulado</span>
                        <span className="text-3xl font-black tracking-tighter text-slate-950 dark:text-white">
                          {formatCurrency(calculateTotal(comanda.items))}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="rounded-2xl h-14 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                          onClick={() => {
                            setSelectedComanda(comanda);
                            setIsItemsModalOpen(true);
                          }}
                        >
                          <Plus size={18} className="mr-2" />
                          Itens
                        </Button>
                        <Button 
                          variant="premium" 
                          size="lg"
                          className="rounded-2xl h-14 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                          onClick={() => handlePay(comanda.id)}
                          disabled={comanda.items.length === 0}
                        >
                          <CheckCircle size={18} className="mr-2" />
                          Pagar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals - All Improved with better UI */}
      {/* Modal Abrir Comanda */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Comanda"
      >
        <form onSubmit={handleCreateComanda} className="space-y-6 p-2">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Identificação do Cliente</label>
            <Input 
              required 
              placeholder="Ex: Mesa 04 ou Nome do Cliente" 
              className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-gold-500/20"
              value={newComandaName}
              onChange={(e) => setNewComandaName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold" className="flex-1 h-14 rounded-2xl font-bold">
              Abrir Agora
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Comanda */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Comanda"
      >
        {editingComanda && (
          <form onSubmit={handleEditComanda} className="space-y-6 p-2">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nova Identificação</label>
              <Input 
                required 
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-gold-500/20"
                value={editingComanda.customerName}
                onChange={(e) => setEditingComanda({...editingComanda, customerName: e.target.value})}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="premium" className="flex-1 h-14 rounded-2xl font-bold">
                Salvar
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Adicionar Itens - Full Catalog UI */}
      <Modal
        isOpen={isItemsModalOpen}
        onClose={() => setIsItemsModalOpen(false)}
        title={`Pedidos: ${selectedComanda?.customerName}`}
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
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-gold-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors">
                      <ShoppingBag size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold tracking-tight">{product.name}</p>
                      <p className="text-[10px] font-black text-gold-600 uppercase tracking-widest">{product.category} • {formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <Button 
                    variant="premium" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl"
                    onClick={() => handleAddItem(selectedComanda.id, product)}
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold" onClick={() => setIsItemsModalOpen(false)}>
              Concluir Pedidos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
