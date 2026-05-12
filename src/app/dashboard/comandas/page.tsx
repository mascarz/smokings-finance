"use client";

import React, { useState } from "react";
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
  MoreVertical,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ComandasPage() {
  const { products, comandas, addComanda, addItemToComanda, updateComandaItem, payComanda } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [selectedComanda, setSelectedComanda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [newComandaName, setNewComandaName] = useState("");

  const handleCreateComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComandaName.trim()) return;
    addComanda({ customerName: newComandaName });
    setIsModalOpen(false);
    setNewComandaName("");
    toast("Comanda aberta!");
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
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comandas Ativas</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie o consumo das mesas e clientes em tempo real.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2 w-full md:w-auto justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Abrir Comanda
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar comanda por nome..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComandas.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
            <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
            Nenhuma comanda aberta no momento.
          </div>
        ) : (
          filteredComandas.map((comanda) => (
            <Card key={comanda.id} className="border-gold-500/20 shadow-lg hover:shadow-gold-500/5 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
                    <User size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{comanda.customerName}</CardTitle>
                    <CardDescription>Aberta em {new Date(comanda.date).toLocaleTimeString()}</CardDescription>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                  Ativa
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  {comanda.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">Nenhum item adicionado.</p>
                  ) : (
                    comanda.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between text-sm p-2 rounded-lg bg-secondary/30">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{formatCurrency(item.price)} cada</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateComandaItem(comanda.id, item.productId, item.quantity - 1)}>
                            <MinusCircle size={16} className="text-muted-foreground hover:text-primary" />
                          </button>
                          <span className="w-4 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateComandaItem(comanda.id, item.productId, item.quantity + 1)}>
                            <PlusCircle size={16} className="text-muted-foreground hover:text-primary" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(calculateTotal(comanda.items))}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSelectedComanda(comanda);
                      setIsItemsModalOpen(true);
                    }}
                  >
                    <ShoppingBag size={14} />
                    Itens
                  </Button>
                  <Button 
                    variant="premium" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => handlePay(comanda.id)}
                    disabled={comanda.items.length === 0}
                  >
                    <CheckCircle size={14} />
                    Pagar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Abrir Comanda */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Abrir Nova Comanda"
      >
        <form onSubmit={handleCreateComanda} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Identificação (Nome ou Mesa)</label>
            <Input 
              required 
              placeholder="Ex: Mesa 04 ou João Silva" 
              value={newComandaName}
              onChange={(e) => setNewComandaName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1">
              Abrir Comanda
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Adicionar Itens */}
      <Modal
        isOpen={isItemsModalOpen}
        onClose={() => setIsItemsModalOpen(false)}
        title={`Adicionar Itens: ${selectedComanda?.customerName}`}
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Pesquisar no catálogo..." 
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
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border hover:border-primary/30 transition-all group"
                >
                  <div>
                    <p className="font-bold text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category} • {formatCurrency(product.price)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleAddItem(selectedComanda.id, product)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="outline" onClick={() => setIsItemsModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}