"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";

export default function RegisterPage() {
  const router = useRouter();
  const { login, clearAllData, registerUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast("Criando sua conta premium...", "info");
    
    // Simular registro e limpeza de dados para novo dono
    setTimeout(() => {
      clearAllData();
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        isOwner: true,
      };
      registerUser(userData);
      login({
        name: userData.name,
        email: userData.email,
        isOwner: true,
        ownerEmail: userData.email
      });
      setIsLoading(false);
      toast("Conta criada com sucesso! Ambiente zerado e pronto.");
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        <Card className="border-border shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-2xl">S</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">Crie sua conta SaaS</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Comece a gerenciar sua tabacaria com tecnologia de ponta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="text" 
                    placeholder="Nome completo" 
                    className="pl-12" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="tel" 
                    placeholder="Telefone / WhatsApp" 
                    className="pl-12" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="email" 
                  placeholder="E-mail profissional" 
                  className="pl-12" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="password" 
                  placeholder="Crie uma senha forte" 
                  className="pl-12" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <p className="text-xs text-muted-foreground px-1">
                Ao se registrar, você concorda com nossos{" "}
                <Link href="#" className="underline hover:text-primary">Termos de Serviço</Link> e{" "}
                <Link href="#" className="underline hover:text-primary">Política de Privacidade</Link>.
              </p>
              <Button type="submit" variant="premium" className="w-full h-12 text-lg mt-2" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Criando conta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Criar Minha Conta <ArrowRight size={18} />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Já possui uma conta?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Fazer login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
