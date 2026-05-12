"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  DollarSign, 
  PieChart, 
  Briefcase, 
  UserCircle,
  Bell,
  ShoppingBag,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
        active 
          ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xl shadow-slate-200 dark:shadow-black/20" 
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
      )}
    >
      <Icon size={20} className={cn("transition-all duration-300 group-hover:scale-110", active ? "text-inherit" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
      <span className="font-semibold text-sm tracking-tight">{label}</span>
      {active && (
        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  const { user, logout: contextLogout } = useApp();

  const handleLogout = () => {
    toast("Saindo do sistema...", "info");
    setTimeout(() => {
      contextLogout();
      router.push("/login");
    }, 1000);
  };

  const menuItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/comandas", icon: ClipboardList, label: "Comandas" },
    { href: "/dashboard/vendas", icon: ShoppingBag, label: "Vendas" },
    { href: "/dashboard/notinhas", icon: FileText, label: "Notinhas" },
    { href: "/dashboard/inventario", icon: Package, label: "Inventário" },
    { href: "/dashboard/financeiro", icon: BarChart3, label: "Relatórios" },
    { href: "/dashboard/gastos", icon: DollarSign, label: "Gastos" },
    { href: "/dashboard/crm", icon: Users, label: "Clientes" },
    { href: "/dashboard/funcionarios", icon: Briefcase, label: "Equipe" },
    { href: "/dashboard/ai", icon: Zap, label: "Inteligência IA" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-10 px-2 py-4">
        <div className="w-10 h-10 rounded-2xl bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/20">
          <ShoppingBag className="text-white" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-tighter leading-none">SMOKINGS</span>
          <span className="text-[10px] font-bold text-gold-600 tracking-[0.2em] uppercase">Premium Admin</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5">
        <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu Principal</p>
        {menuItems.map((item) => (
          <div key={item.href} onClick={() => setIsSidebarOpen(false)}>
            <SidebarItem 
              {...item} 
              active={pathname === item.href} 
            />
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-slate-200 dark:border-slate-800">
        <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configurações</p>
        <div onClick={() => setIsSidebarOpen(false)}>
          <SidebarItem href="/dashboard/perfil" icon={UserCircle} label="Meu Perfil" active={pathname === "/dashboard/perfil"} />
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 group w-full text-left"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-semibold text-sm tracking-tight">Sair da Conta</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-gold-500/30">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 p-6 fixed inset-y-0 bg-white dark:bg-slate-950/50 backdrop-blur-xl z-40">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col w-full min-w-0">
        {/* Header */}
        <header className="h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-30 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="lg:block">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Gestão de Tabacaria</h2>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight">{user?.name || "Premium User"}</h1>
                <div className="px-2 py-0.5 rounded-md bg-gold-500/10 text-gold-600 text-[10px] font-bold uppercase tracking-wider">Proprietário</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell size={20} className="text-slate-500" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-background"></span>
              </Button>
              <ThemeToggle />
            </div>
            
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-end hidden xs:flex">
                <span className="text-sm font-bold tracking-tight leading-none">{user?.name || "Admin"}</span>
                <span className="text-[10px] text-slate-400 font-medium">Online agora</span>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
                <UserCircle size={24} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 lg:p-12 flex-1 w-full max-w-7xl mx-auto overflow-x-hidden animate-in">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-background border-r border-border p-6 z-50 transition-transform duration-300 lg:hidden flex flex-col shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-end mb-4">
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-accent rounded-lg">
            <X size={24} />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </div>
  );
}

// Add icons import
import { Zap, ClipboardList, Package } from "lucide-react";
