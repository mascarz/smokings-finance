"use client";

import React, { useState } from "react";
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
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency } from "@/lib/utils";

export default function NotinhasPage() {
  const { products, notinhas, addNotinha, updateNotinha, payNotinha } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [editingNotinha, setEditingNotinha] = useState<any>(null);

  const [newNotinha, setNewNotinha] = useState({
    customerName: "",
    product: "",
    price: "",
  });

  const handleAddNotinha = (e: React.FormEvent) => {
    e.preventDefault();
    addNotinha({
      customerName: newNotinha.customerName,
      product: newNotinha.product,
      price: parseFloat(newNotinha.price),
    });
    setIsModalOpen(false);
    setNewNotinha({ customerName: "", product: "", price: "" });
    toast("Notinha criada com sucesso!");
  };

  const handleEditNotinha = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotinha) {
      updateNotinha(editingNotinha.id, {
        customerName: editingNotinha.customerName,
        product: editingNotinha.product,
        price: parseFloat(editingNotinha.price),
      });
      setIsEditModalOpen(false);
      setEditingNotinha(null);
      toast("Notinha atualizada!");
    }
  };

  const handleSelectProduct = (product: any) => {
    setNewNotinha({
      ...newNotinha,
      product: product.name,
      price: product.price.toString()
    });
    setIsProductModalOpen(false);
    toast(`${product.name} selecionado!`);
  };

  const handlePay = (id: string, customerName: string) => {
    if (confirm(`Confirmar pagamento da notinha de ${customerName}? O valor será adicionado ao faturamento.`)) {
      payNotinha(id);
      toast(`Notinha de ${customerName} paga e faturada!`);
    }
  };

  const filteredNotinhas = notinhas.filter(n => 
    n.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const pendingTotal = notinhas
    .filter(n => n.status === 'pendente')
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sistema de Notinhas</h1>
          <p className="text-sm md:text-base text-muted-foreground">Controle o "fiado" e as pendências de cada cliente de forma organizada.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2 w-full md:w-auto justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Nova Notinha
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-rose-500/5 border-rose-500/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-rose-600 font-bold uppercase text-[10px]">Total Pendente</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-rose-600">{formatCurrency(pendingTotal)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-amber-600 font-bold uppercase text-[10px]">Notinhas em Aberto</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-amber-600">
              {notinhas.filter(n => n.status === 'pendente').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/10 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-emerald-600 font-bold uppercase text-[10px]">Total Recebido</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-emerald-600">
              {formatCurrency(notinhas.filter(n => n.status === 'pago').reduce((acc, curr) => acc + curr.price, 0))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar por nome do cliente ou produto..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotinhas.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-dashed border-border rounded-3xl text-muted-foreground">
            Nenhuma notinha registrada ainda.
          </div>
        ) : (
          filteredNotinhas.map((n) => (
            <Card key={n.id} className={`group transition-all ${n.status === 'pago' ? 'opacity-60 grayscale' : 'hover:border-primary shadow-lg'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    n.status === 'pendente' ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                  )}>
                    <User size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{n.customerName}</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-wider">
                      {new Date(n.date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    n.status === 'pendente' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {n.status}
                  </div>
                  {n.status === 'pendente' && (
                    <button 
                      onClick={() => {
                        setEditingNotinha({ ...n, price: n.price.toString() });
                        setIsEditModalOpen(true);
                      }}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Produto/Serviço:</p>
                    <p className="font-bold text-sm">{n.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-primary">{formatCurrency(n.price)}</p>
                  </div>
                </div>
                
                {n.status === 'pendente' && (
                  <Button 
                    variant="premium" 
                    size="sm" 
                    className="w-full mt-6 gap-2"
                    onClick={() => handlePay(n.id, n.customerName)}
                  >
                    <CheckCircle2 size={16} /> Marcar como Pago
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Nova Notinha */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Notinha"
      >
        <form onSubmit={handleAddNotinha} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Nome do Cliente</label>
            <Input 
              required 
              placeholder="Ex: Carlos Andrade" 
              value={newNotinha.customerName}
              onChange={(e) => setNewNotinha({...newNotinha, customerName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">O que comprou?</label>
              <button 
                type="button"
                className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                onClick={() => setIsProductModalOpen(true)}
              >
                <Package size={12} />
                Pegar do Inventário
              </button>
            </div>
            <Input 
              required 
              placeholder="Ex: Narguilé + Essência" 
              value={newNotinha.product}
              onChange={(e) => setNewNotinha({...newNotinha, product: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Preço (R$)</label>
            <Input 
              required 
              type="number" 
              step="0.01"
              placeholder="0,00" 
              value={newNotinha.price}
              onChange={(e) => setNewNotinha({...newNotinha, price: e.target.value})}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1">
              Criar Notinha
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Notinha */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Notinha"
      >
        {editingNotinha && (
          <form onSubmit={handleEditNotinha} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Nome do Cliente</label>
              <Input 
                required 
                value={editingNotinha.customerName}
                onChange={(e) => setEditingNotinha({...editingNotinha, customerName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">O que comprou?</label>
              <Input 
                required 
                value={editingNotinha.product}
                onChange={(e) => setEditingNotinha({...editingNotinha, product: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Preço (R$)</label>
              <Input 
                required 
                type="number" 
                step="0.01"
                value={editingNotinha.price}
                onChange={(e) => setEditingNotinha({...editingNotinha, price: e.target.value})}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="premium" className="flex-1">
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Escolher Produto do Inventário */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Escolher do Inventário"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Pesquisar produto..." 
              className="pl-9 h-9 text-sm"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredProducts.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground italic">Nenhum produto cadastrado.</p>
            ) : (
              filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => handleSelectProduct(product)}
                >
                  <div>
                    <p className="font-bold text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category} • {formatCurrency(product.price)}</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}