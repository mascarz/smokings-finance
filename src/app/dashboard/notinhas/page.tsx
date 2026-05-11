"use client";

import React, { useState } from "react";
import { Plus, Search, FileText, CheckCircle2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency } from "@/lib/utils";

export default function NotinhasPage() {
  const { notinhas, addNotinha, payNotinha } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredNotinhas = notinhas.filter(n => 
    n.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTotal = notinhas
    .filter(n => n.status === 'pendente')
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Notinhas</h1>
          <p className="text-muted-foreground">Controle o "fiado" e as pendências de cada cliente de forma organizada.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Nova Notinha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-rose-500/5 border-rose-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-rose-600 font-bold uppercase text-[10px]">Total Pendente</CardDescription>
            <CardTitle className="text-3xl font-bold text-rose-600">{formatCurrency(pendingTotal)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-600 font-bold uppercase text-[10px]">Notinhas em Aberto</CardDescription>
            <CardTitle className="text-3xl font-bold text-amber-600">
              {notinhas.filter(n => n.status === 'pendente').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-600 font-bold uppercase text-[10px]">Total Recebido</CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-600">
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
            <Card key={n.id} className={`group transition-all ${n.status === 'pago' ? 'opacity-60' : 'hover:border-primary'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{n.customerName}</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-wider">
                      {new Date(n.date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  n.status === 'pendente' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {n.status}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium">O que comprou:</p>
                    <p className="font-bold text-sm">{n.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold">{formatCurrency(n.price)}</p>
                  </div>
                </div>
                
                {n.status === 'pendente' && (
                  <Button 
                    variant="premium" 
                    size="sm" 
                    className="w-full mt-6 gap-2"
                    onClick={() => {
                      payNotinha(n.id);
                      toast(`Notinha de ${n.customerName} marcada como paga!`);
                    }}
                  >
                    <CheckCircle2 size={16} /> Marcar como Pago
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Notinha de Cliente"
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
            <label className="text-sm font-bold">O que comprou?</label>
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
    </div>
  );
}
