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
  const { employees: contextEmployees, addEmployee, updateEmployeePermissions } = useApp();
  const [employees, setEmployees] = useState(contextEmployees.length > 0 ? contextEmployees : []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const { toast } = useToast();

  const [permissions, setPermissions] = useState<string[]>([]);
  const availablePermissions = [
    { id: 'vendas', label: 'Realizar Vendas' },
    { id: 'produtos', label: 'Gerenciar Estoque' },
    { id: 'financeiro', label: 'Ver Relatórios' },
    { id: 'funcionarios', label: 'Gerenciar Equipe' },
    { id: 'gastos', label: 'Lançar Despesas' },
    { id: 'crm', label: 'Ver Clientes' },
  ];

  const handleOpenPermissions = (emp: any) => {
    setSelectedEmployee(emp);
    setPermissions(emp.permissions || []);
    setIsPermissionsModalOpen(true);
  };

  const handleSavePermissions = () => {
    if (selectedEmployee) {
      updateEmployeePermissions(selectedEmployee.email, permissions);
      setIsPermissionsModalOpen(false);
      toast("Permissões atualizadas com sucesso!");
    }
  };

  const togglePermission = (permId: string) => {
    setPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(p => p !== permId) 
        : [...prev, permId]
    );
  };

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
          onClick={() => {
            if (filteredEmployees.length > 0) {
              handleOpenPermissions(filteredEmployees[0]);
            } else {
              toast("Nenhum funcionário encontrado.", "warning");
            }
          }}
        >
          <Shield size={18} />
          Gerenciar Permissões
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <Card key={emp.id} className="hover:border-primary/20 transition-all group overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-lg text-slate-600 dark:text-slate-300">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-lg">{emp.name}</CardTitle>
                  <CardDescription>{emp.role}</CardDescription>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                emp.status === "Ativo" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
              }`}>
                {emp.status}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Mail size={14} className="text-slate-400" />
                  {emp.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Phone size={14} className="text-slate-400" />
                  {emp.phone}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Acessos Ativos:</p>
                <div className="flex flex-wrap gap-1.5">
                  {emp.permissions.map((perm: string) => (
                    <span key={perm} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-600 dark:text-slate-400">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-xl font-bold text-xs h-9 text-slate-600"
                  onClick={() => handleOpenPermissions(emp)}
                >
                  <Shield size={14} className="mr-2" />
                  Permissões
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                  onClick={() => handleDeleteEmployee(emp.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Modal */}
      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        title={`Gerenciar Permissões - ${selectedEmployee?.name}`}
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">E-mail do Funcionário</p>
            <p className="font-black text-slate-700 dark:text-slate-300">{selectedEmployee?.email}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {availablePermissions.map((perm) => (
              <button
                key={perm.id}
                onClick={() => togglePermission(perm.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                  permissions.includes(perm.id)
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    permissions.includes(perm.id) ? "bg-emerald-500/20" : "bg-slate-100 dark:bg-slate-800"
                  )}>
                    <Shield size={18} />
                  </div>
                  <span className="font-bold">{perm.label}</span>
                </div>
                {permissions.includes(perm.id) && <Check size={20} className="text-emerald-500" />}
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsPermissionsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="premium" className="flex-1 h-14 rounded-2xl font-bold" onClick={handleSavePermissions}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </Modal>

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
