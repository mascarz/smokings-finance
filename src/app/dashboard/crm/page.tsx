"use client";

import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Star, 
  MessageSquare, 
  History, 
  Filter,
  MoreVertical,
  Crown,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

import { useApp } from "@/lib/context";

export default function CRMPage() {
  const { customers: contextCustomers, addCustomer } = useApp();
  const [customers, setCustomers] = useState(contextCustomers.length > 0 ? contextCustomers : []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Sincronizar com context
  React.useEffect(() => {
    if (contextCustomers.length > 0) {
      setCustomers(contextCustomers);
    }
  }, [contextCustomers]);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    isVip: false,
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (customers.length + 1).toString();
    const customerToAdd = {
      ...newCustomer,
      id,
      totalSpent: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      ranking: customers.length + 1,
    };
    addCustomer(customerToAdd);
    setCustomers([customerToAdd, ...customers]);
    setIsModalOpen(false);
    setNewCustomer({ name: "", email: "", phone: "", isVip: false });
    toast("Cliente cadastrado com sucesso!");
  };

  const filteredCustomers = customers.filter(cust => 
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Empresarial</h1>
          <p className="text-muted-foreground">Gerencie o relacionamento com seus clientes e fidelize os melhores.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={18} />
          Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary/60 font-bold uppercase text-[10px]">Total de Clientes</CardDescription>
            <CardTitle className="text-3xl font-bold">{customers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gold-500/5 border-gold-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-gold-600 font-bold uppercase text-[10px]">Clientes VIP</CardDescription>
            <CardTitle className="text-3xl font-bold text-gold-600">
              {customers.filter(c => c.isVip).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-600 font-bold uppercase text-[10px]">Fidelização (Mês)</CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-600">
              {customers.length > 0 ? "100%" : "0%"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-secondary/50 border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-bold uppercase text-[10px]">Ticket Médio Cliente</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(customers.length > 0 ? customers.reduce((acc, curr) => acc + curr.totalSpent, 0) / customers.length : 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar por nome, e-mail ou telefone..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => toast("Segmentação avançada em breve!", "info")}
        >
          <Filter size={18} /> Segmentar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((cust) => (
          <Card key={cust.id} className="hover:border-primary/20 transition-all group overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/3 p-6 bg-secondary/30 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-border">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold mb-2">
                    {cust.name.charAt(0)}
                  </div>
                  {cust.isVip && (
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white border-4 border-background">
                      <Crown size={14} />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-center">{cust.name}</h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 ${
                  cust.isVip ? "bg-gold-500/10 text-gold-600" : "bg-muted text-muted-foreground"
                }`}>
                  {cust.isVip ? "Cliente VIP" : "Standard"}
                </span>
              </div>
              <div className="sm:w-2/3 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Gasto</p>
                    <p className="font-bold text-lg">{formatCurrency(cust.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Última Visita</p>
                    <p className="font-medium text-sm">{new Date(cust.lastVisit).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Engajamento</p>
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gold-500 h-full" 
                        style={{ width: `${cust.isVip ? 85 : 45}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-full"
                      onClick={() => toast(`Iniciando chat com ${cust.name}...`, "info")}
                    >
                      <MessageSquare size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-full"
                      onClick={() => toast("Histórico detalhado em breve!", "info")}
                    >
                      <History size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Cliente"
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Nome do Cliente</label>
            <Input 
              required 
              placeholder="Ex: Carlos Eduardo" 
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">E-mail</label>
            <Input 
              type="email" 
              placeholder="carlos@gmail.com" 
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Telefone / WhatsApp</label>
            <Input 
              required 
              placeholder="(11) 95555-4444" 
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <input 
              type="checkbox" 
              id="isVip"
              checked={newCustomer.isVip}
              onChange={(e) => setNewCustomer({...newCustomer, isVip: e.target.checked})}
              className="w-5 h-5 accent-gold-500"
            />
            <label htmlFor="isVip" className="text-sm font-bold cursor-pointer">Definir como Cliente VIP</label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1">
              Cadastrar Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
