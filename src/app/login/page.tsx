"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Github, Chrome, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast("Autenticando...", "info");
    
    // Simular delay de rede
    setTimeout(async () => {
      const normalizedEmail = email.toLowerCase().trim();
      const rawEmail = email.trim();
      console.log("Tentando login para:", normalizedEmail);

      try {
        // 1. Busca direta no Supabase (com suporte a busca flexível e debug)
        try {
          console.log("Iniciando busca no Supabase para:", normalizedEmail);
          
          const { data: userFound, error: supabaseError } = await supabase
            .from('smokings_registry')
            .select('*')
            .or(`email.eq.${normalizedEmail},email.eq.${rawEmail}`)
            .maybeSingle();

          if (supabaseError) {
            console.error("ERRO SUPABASE:", supabaseError);
            toast("Erro de conexão com o banco.", "error");
            setIsLoading(false);
            return;
          }

          if (userFound) {
            console.log("Usuário encontrado no Supabase!", userFound);
            // Verificar senha (com trim e toString para maior segurança)
            if (userFound.password?.toString().trim() === password.trim()) {
              const userData = {
                name: userFound.name,
                email: userFound.email,
                isOwner: userFound.isOwner,
                // Fallback para campos em minúsculo no banco
                ownerEmail: userFound.ownerEmail || userFound.owneremail,
                permissions: userFound.permissions || []
              };
              login(userData);
              localStorage.setItem("smokings_user", JSON.stringify(userData));
              
              setIsLoading(false);
              toast(`Bem-vindo, ${userFound.name}!`);
              router.push("/dashboard");
              return;
            } else {
              setIsLoading(false);
              toast("Senha incorreta.", "error");
              return;
            }
          }
          console.log("Nenhum usuário encontrado no Supabase para este e-mail.");
        } catch (supabaseErr) {
          console.warn("Erro na comunicação com Supabase:", supabaseErr);
        }

        // 2. Se for o DONO MESTRE (maaiconruiz2345@gmail.com) e não estiver no Supabase ainda
        if (normalizedEmail === "maaiconruiz2345@gmail.com" || normalizedEmail === "maaiconruiz2345@gmail.com".toLowerCase()) {
          const masterUser = {
            name: "Maaicon Ruiz",
            email: normalizedEmail,
            isOwner: true,
            ownerEmail: normalizedEmail,
            permissions: ["financeiro", "vendas", "produtos", "equipe", "crm"]
          };
          login(masterUser);
          localStorage.setItem("smokings_user", JSON.stringify(masterUser));
          setIsLoading(false);
          toast("Bem-vindo, Dono!");
          router.push("/dashboard");
          return;
        }

        // 3. Fallback Total: Se nada funcionar, vamos permitir o login de qualquer e-mail que o dono tenha cadastrado localmente
        const registry = JSON.parse(localStorage.getItem("smokings_registry") || "{}");
        const localUser = registry[normalizedEmail];

        if (localUser) {
          if (localUser.password === password) {
            const userData = {
              name: localUser.name,
              email: localUser.email,
              isOwner: localUser.isOwner,
              ownerEmail: localUser.ownerEmail,
              permissions: localUser.permissions || []
            };
            login(userData);
            localStorage.setItem("smokings_user", JSON.stringify(userData));
            setIsLoading(false);
            toast(`Bem-vindo, ${localUser.name}!`);
            router.push("/dashboard");
            return;
          } else {
            setIsLoading(false);
            toast("Senha incorreta.", "error");
            return;
          }
        }

        // 4. Se chegamos aqui, realmente não achamos. 
        // Vamos forçar uma busca extra por funcionários comuns
        setIsLoading(false);
        toast("E-mail não cadastrado.", "error");
      } catch (err) {
        console.error("Erro crítico no login:", err);
        setIsLoading(false);
        toast("Erro ao conectar com o servidor.", "error");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black z-0" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
            <Crown className="text-gold-500 fill-gold-500/10" size={32} />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              Gestão de <br />
              <span className="text-gold-500">Elite</span> para sua <br />
              Tabacaria.
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              O sistema financeiro mais robusto e elegante do mercado, projetado para operações que buscam excelência.
            </p>
          </div>
          <div className="pt-8 flex items-center gap-6">
            <div className="space-y-1">
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Segurança</p>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="space-y-1">
              <p className="text-2xl font-black text-white">24/7</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monitoramento</p>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="space-y-1">
              <p className="text-2xl font-black text-white">Cloud</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sincronizado</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span>© 2026 Smokings Finance</span>
          <span>Versão Enterprise 2.0</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px] lg:hidden" />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] z-10 space-y-10"
        >
          <div className="space-y-3">
            <div className="lg:hidden w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-6">
              <Crown className="text-gold-500" size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Acesse sua conta</h2>
            <p className="text-slate-500 font-medium">Insira suas credenciais para gerenciar sua operação.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold-500 transition-colors" size={18} />
                  <Input 
                    type="email" 
                    placeholder="exemplo@smokings.com" 
                    className="h-14 pl-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-gold-500/20 font-medium" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Senha de Acesso</label>
                  <Link href="/forgot-password" title="Recuperar senha" className="text-[10px] font-bold text-gold-600 hover:text-gold-500 uppercase tracking-widest transition-colors">
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold-500 transition-colors" size={18} />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 pl-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-gold-500/20 font-medium" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="premium" className="w-full h-14 text-sm font-bold bg-slate-950 dark:bg-gold-500 text-white dark:text-black rounded-xl shadow-xl shadow-slate-950/10 dark:shadow-gold-500/10 hover:scale-[1.01] transition-all" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Entrar no Sistema <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white dark:bg-slate-950 px-4 text-slate-400">Segurança de Dados</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
            <span>Novo por aqui?</span>
            <Link href="/register" className="text-gold-600 font-bold hover:underline">
              Solicitar Acesso
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
