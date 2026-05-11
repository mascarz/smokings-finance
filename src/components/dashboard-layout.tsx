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
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon size={20} className={cn("transition-transform duration-200 group-hover:scale-110", active ? "text-primary-foreground" : "text-muted-foreground")} />
      <span className="font-medium">{label}</span>
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
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/dashboard/vendas", icon: ShoppingBag, label: "Vendas" },
    { href: "/dashboard/notinhas", icon: FileText, label: "Notinhas" },
    { href: "/dashboard/financeiro", icon: BarChart3, label: "Financeiro" },
    { href: "/dashboard/gastos", icon: DollarSign, label: "Gastos" },
    { href: "/dashboard/crm", icon: Users, label: "Clientes" },
    { href: "/dashboard/funcionarios", icon: Briefcase, label: "Funcionários" },
    { href: "/dashboard/ai", icon: Zap, label: "IA Financeira" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-border p-6 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-black font-bold">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight">SMOKINGS</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href} 
              {...item} 
              active={pathname === item.href} 
            />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-border">
          <SidebarItem href="/dashboard/perfil" icon={UserCircle} label="Meu Perfil" active={pathname === "/dashboard/perfil"} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 group w-full text-left"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-border px-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <button 
            className="lg:hidden p-2 hover:bg-accent rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-muted-foreground">Bem-vindo de volta,</h2>
            <h1 className="text-xl font-bold">Dono da Tabacaria</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold-500 rounded-full"></span>
            </Button>
            <ThemeToggle />
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
              <UserCircle size={24} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-10 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-background border-r border-border p-6 z-50 transition-transform duration-300 lg:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black font-bold">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight">SMOKINGS</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-accent rounded-lg">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href} 
              {...item} 
              active={pathname === item.href} 
            />
          ))}
        </nav>
      </aside>
    </div>
  );
}

// Add Zap icon import
import { Zap } from "lucide-react";
