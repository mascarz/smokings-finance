"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Menu,
  X,
  ShoppingBag,
  Users,
  ChevronRight,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      title: "Controle Financeiro",
      description: "Gestão completa de entradas, saídas e fluxo de caixa em tempo real.",
      icon: BarChart3,
      color: "text-gold-500",
      bg: "bg-gold-500/10"
    },
    {
      title: "Gestão de Equipe",
      description: "Cadastre funcionários e defina permissões de acesso específicas.",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Mobile First",
      description: "Acesse e gerencie sua tabacaria de qualquer lugar pelo celular.",
      icon: Smartphone,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Inteligência de Vendas",
      description: "Relatórios detalhados e insights para aumentar seu faturamento.",
      icon: Zap,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-gold-500/30">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border py-4" : "bg-transparent py-6"
      }`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="font-black text-2xl tracking-tighter">SMOKINGS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#funcionalidades" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Funcionalidades</Link>
            <Link href="#sobre" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Sobre</Link>
            <Link href="#contato" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Suporte</Link>
            <div className="h-4 w-[1px] bg-border mx-2"></div>
            <Link href="/login">
              <Button variant="ghost" className="font-bold">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button variant="premium" className="rounded-full px-6 shadow-xl shadow-gold-500/20">Começar Agora</Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-[10px] font-bold uppercase tracking-widest text-gold-600 mb-6">
                <Zap size={12} className="fill-gold-600" />
                O Software nº1 para Tabacarias
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Gestão Premium para sua <span className="gold-text-gradient">Tabacaria & Lounge</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto font-medium">
                Controle seu estoque, faturamento e equipe com a plataforma mais sofisticada do mercado. Criada para quem busca excelência.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="premium" className="w-full sm:w-auto h-14 px-10 text-lg rounded-2xl shadow-2xl shadow-gold-500/30 group">
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg rounded-2xl border-2 group">
                <Play className="mr-2 fill-current" size={18} />
                Ver Demonstração
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-12 relative"
            >
              <div className="relative rounded-[2rem] border border-border bg-card/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2070&auto=format&fit=crop" 
                  alt="Dashboard Preview" 
                  className="rounded-[1.5rem] w-full shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="funcionalidades" className="py-24 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Tudo o que você precisa</h2>
            <p className="text-muted-foreground font-medium">Funcionalidades pensadas exclusivamente para o dia a dia de uma tabacaria de alto padrão.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-8 space-y-4">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center`}>
                      <feature.icon className={feature.color} size={28} />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/20">
              <ShoppingBag className="text-white" size={16} />
            </div>
            <span className="font-black text-xl tracking-tighter">SMOKINGS</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            © 2024 Smokings Premium System. Todos os direitos reservados.
            A ferramenta definitiva para gestão de tabacarias.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><ShieldCheck size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Smartphone size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Zap size={20} /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
