"use client";

import { ArrowRight, BarChart3, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
      {/* Hero Section */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-xl">S</span>
          </div>
          <span className="font-bold text-xl tracking-tight">SMOKINGS</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link>
          <Link href="#about" className="hover:text-primary transition-colors">Sobre</Link>
          <Link href="/login" className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Entrar
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold mb-6"
          >
            <Zap size={14} />
            <span>SISTEMA SAAS PREMIUM</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-tight"
          >
            Gestão Financeira Inteligente para <span className="text-gold-600">Sua Tabacaria</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl"
          >
            Acompanhe seu faturamento, gerencie funcionários e clientes, e utilize IA para prever tendências. Tudo em uma interface ultra moderna e sofisticada.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/register" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
              Começar Agora <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="px-8 py-4 rounded-full border border-border font-bold hover:bg-accent transition-colors">
              Ver Demonstração
            </Link>
          </motion.div>
        </section>

        <section id="features" className="px-6 py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="premium-card p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold">Dashboard Financeiro</h3>
              <p className="text-muted-foreground">Gráficos interativos e estatísticas em tempo real do seu faturamento e lucros.</p>
            </div>
            <div className="premium-card p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500 text-white flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold">Segurança Avançada</h3>
              <p className="text-muted-foreground">Autenticação segura, sessões protegidas e controle total de permissões.</p>
            </div>
            <div className="premium-card p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold">Gestão de CRM</h3>
              <p className="text-muted-foreground">Conheça seus melhores clientes e crie relacionamentos duradouros.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">
          © 2026 Smokings Tabacaria Lounge. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-primary">Termos</Link>
          <Link href="#" className="hover:text-primary">Privacidade</Link>
        </div>
      </footer>
    </div>
  );
}
