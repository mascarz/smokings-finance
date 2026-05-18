"use client";

import React from "react";
import { User, Mail, Phone, Shield, Bell, Save, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from "@/lib/context";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase";

export default function PerfilPage() {
  const { clearAllData, user, login, logout } = useApp();
  const { toast } = useToast();

  const handleResetData = () => {
    if (confirm("ATENÇÃO: Isso apagará todos os dados locais deste navegador e recarregará as informações da nuvem. Deseja continuar?")) {
      clearAllData();
      toast("Memória local limpa com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      // No momento, apenas salvando dados estáticos ou futuras preferências
      toast("Perfil atualizado!");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      toast("Erro ao salvar perfil.", "error");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações da conta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gold-500/10 flex items-center justify-center text-4xl font-bold border-4 border-gold-500 shadow-xl mb-4 text-gold-600">
                {user?.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <h3 className="font-bold text-lg">{user?.name || "Dono Smokings"}</h3>
              <p className="text-sm text-muted-foreground">{user?.isOwner ? "Proprietário" : "Funcionário"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Shield size={16} /> Status da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plano:</span>
                <span className="font-bold text-gold-600">Premium SaaS</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Membro desde:</span>
                <span className="font-medium">Maio 2026</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Dados cadastrais do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Nome</label>
                  <Input value={user?.name || ""} disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">E-mail</label>
                  <Input value={user?.email || ""} disabled className="bg-slate-50" />
                </div>
              </div>
              
              <Button variant="premium" className="flex items-center gap-2" onClick={handleSaveProfile}>
                <Save size={18} /> Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações que podem afetar seus dados permanentemente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/10">
                <div className="flex items-center gap-3">
                  <Trash2 size={24} className="text-destructive" />
                  <div>
                    <p className="text-sm font-bold text-destructive">Resetar Banco de Dados Local</p>
                    <p className="text-xs text-muted-foreground">Limpa a memória do navegador e força o download da nuvem.</p>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleResetData}
                  className="flex items-center gap-2"
                >
                  <RefreshCcw size={16} /> Resetar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
