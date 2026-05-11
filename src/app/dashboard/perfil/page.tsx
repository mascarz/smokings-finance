"use client";

import React from "react";
import { User, Mail, Phone, Shield, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PerfilPage() {
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
              <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center text-4xl font-bold border-4 border-background shadow-xl mb-4">
                D
              </div>
              <h3 className="font-bold text-lg">Dono da Tabacaria</h3>
              <p className="text-sm text-muted-foreground">Proprietário</p>
              <Button variant="outline" size="sm" className="mt-4 rounded-full">Alterar Foto</Button>
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
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Estes dados são usados para faturas e comunicações oficiais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input defaultValue="Dono da Tabacaria Smokings" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input defaultValue="contato@smokings.com" className="pl-10" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input defaultValue="(11) 99999-8888" className="pl-10" />
                </div>
              </div>
              <Button variant="premium" className="flex items-center gap-2">
                <Save size={18} /> Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>Personalize como o sistema deve se comportar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-bold">Notificações de Vendas</p>
                    <p className="text-xs text-muted-foreground">Receber alerta a cada nova venda</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold-500" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-bold">Autenticação em Duas Etapas</p>
                    <p className="text-xs text-muted-foreground">Aumentar segurança da conta</p>
                  </div>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-gold-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
