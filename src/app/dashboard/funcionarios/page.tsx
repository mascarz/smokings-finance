"use client";

import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Shield, 
  Check, 
  X,
  Phone,
  Mail,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

import { useApp } from "@/lib/context";

export default function FuncionariosPage() {
  const { employees: contextEmployees, addEmployee } = useApp();
  const [employees, setEmployees] = useState(contextEmployees.length > 0 ? contextEmployees : []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Sincronizar com context se necessário
  React.useEffect(() => {
    if (contextEmployees.length > 0) {
      setEmployees(contextEmployees);
    }
  }, [contextEmployees]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Atendente",
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (employees.length + 1).toString();
    const employeeToAdd = {
      ...newEmployee,
      id,
      status: "Ativo",
      permissions: ["visualizar", "vender"],
    };
    addEmployee(employeeToAdd);
    setEmployees([employeeToAdd, ...employees]);
    setIsModalOpen(false);
    setNewEmployee({ name: "", email: "", phone: "", role: "Atendente" });
    toast("Funcionário cadastrado com sucesso!");
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast("Funcionário removido.", "info");
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Funcionários</h1>
          <p className="text-muted-foreground">Cadastre e gerencie as permissões da sua equipe.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={18} />
          Cadastrar Funcionário
        </Button>
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
          onClick={() => toast("Funcionalidade de permissões em breve!", "info")}
        >
          <Shield size={18} />
          Gerenciar Permissões
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <Card key={emp.id} className="hover:border-primary/20 transition-all group">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-lg">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-lg">{emp.name}</CardTitle>
                  <CardDescription>{emp.role}</CardDescription>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                emp.status === "Ativo" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              }`}>
                {emp.status}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} />
                  {emp.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} />
                  {emp.phone}
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Permissões:</p>
                <div className="flex flex-wrap gap-1">
                  {emp.permissions.map((perm: string) => (
                    <span key={perm} className="px-2 py-1 rounded-md bg-secondary text-[10px] font-medium capitalize">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => toast("Editar funcionário em breve!", "info")}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                  onClick={() => handleDeleteEmployee(emp.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Funcionário"
      >
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Nome Completo</label>
            <Input 
              required 
              placeholder="Ex: João Silva" 
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">E-mail</label>
            <Input 
              required 
              type="email" 
              placeholder="joao@smokings.com" 
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Telefone</label>
            <Input 
              required 
              placeholder="(11) 99999-9999" 
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Cargo</label>
            <select 
              className="w-full h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
            >
              <option value="Atendente">Atendente</option>
              <option value="Gerente">Gerente</option>
              <option value="Segurança">Segurança</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1">
              Cadastrar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
