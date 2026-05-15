"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";

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
      console.log("Tentando login para:", normalizedEmail);

      try {
        // 1. Tentar buscar no registro global do Supabase (para permitir login em qualquer aparelho)
        const isSupabaseConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('sb_publishable');

        if (isSupabaseConfigured) {
          try {
            console.log("Consultando Supabase para:", normalizedEmail);
            // Primeiro, verificar se a tabela existe e o usuário está lá
            const { data: userFound, error } = await supabase
              .from('smokings_registry')
              .select('*')
              .eq('email', normalizedEmail)
              .maybeSingle();

            if (error) {
              console.error("Erro na consulta Supabase:", error);
            }

            if (userFound) {
              console.log("Usuário encontrado no Supabase:", userFound);
              if (userFound.password === password) {
                const userData = {
                  name: userFound.name,
                  email: userFound.email,
                  isOwner: userFound.isOwner,
                  ownerEmail: userFound.ownerEmail,
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
          } catch (supabaseErr) {
            console.warn("Erro ao consultar Supabase, tentando local...", supabaseErr);
          }
        }

        // 2. Se for o DONO MESTRE (maaiconruiz2345@gmail.com) e não estiver no Supabase ainda
        if (normalizedEmail === "maaiconruiz2345@gmail.com") {
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

        // 3. Fallback: Tentar buscar no localStorage
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-border shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-2xl">S</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Acesse seu painel financeiro premium
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="email" 
                    placeholder="E-mail profissional" 
                    className="pl-12" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="password" 
                    placeholder="Sua senha segura" 
                    className="pl-12" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  <input type="checkbox" className="rounded border-border" />
                  Lembrar-me
                </label>
                <Link href="/forgot-password" title="Recuperar senha" className="text-primary font-medium hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Button type="submit" variant="premium" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Acessar Dashboard <ArrowRight size={18} />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl">
                <Chrome className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Começar gratuitamente
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
