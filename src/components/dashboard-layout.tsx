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
  FileText,
  Zap, 
  ClipboardList, 
  Package, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Trash2, 
  Check,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { motion, AnimatePresence } from "framer-motion";

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
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
        active 
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon size={18} className={cn("transition-all duration-200", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="font-semibold text-sm tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-4 bg-gold-500 rounded-r-full" 
        />
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

  // Proteção de rota simplificada
  React.useEffect(() => {
    const savedUser = localStorage.getItem("smokings_user");
    if (!savedUser && !pathname.includes("/login") && !pathname.includes("/register")) {
      router.push("/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    toast("Saindo do sistema...", "info");
    setTimeout(() => {
      contextLogout();
      router.push("/login");
    }, 1000);
  };

  const menuItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", permission: "public" },
    { href: "/dashboard/comandas", icon: ClipboardList, label: "Comandas", permission: "vendas" },
    { href: "/dashboard/vendas", icon: ShoppingBag, label: "Vendas", permission: "vendas" },
    { href: "/dashboard/notinhas", icon: FileText, label: "Notinhas", permission: "vendas" },
    { href: "/dashboard/inventario", icon: Package, label: "Inventário", permission: "produtos" },
    { href: "/dashboard/relatorio", icon: FileText, label: "Relatório Completo", permission: "financeiro" },
    { href: "/dashboard/financeiro", icon: BarChart3, label: "Financeiro", permission: "financeiro" },
    { href: "/dashboard/gastos", icon: DollarSign, label: "Gastos", permission: "gastos" },
    { href: "/dashboard/crm", icon: Users, label: "Clientes", permission: "crm" },
    { href: "/dashboard/funcionarios", icon: Briefcase, label: "Equipe", permission: "funcionarios" },
    { href: "/dashboard/ai", icon: Zap, label: "Inteligência IA", permission: "financeiro" },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (user?.isOwner) return true;
    if (item.permission === "public") return true;
    return user?.permissions?.includes(item.permission);
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-3 mb-10 px-2 py-4 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/10 border border-white/10 group overflow-hidden">
          <div className="relative group-hover:scale-110 transition-transform duration-500">
            <Crown className="text-gold-500 fill-gold-500/20" size={22} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-black text-xl tracking-tight leading-none text-foreground">SMOKINGS</span>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">Finance Control</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Menu</p>
        {filteredMenuItems.map((item) => (
          <div key={item.href} onClick={() => setIsSidebarOpen(false)}>
            <SidebarItem 
              {...item} 
              active={pathname === item.href} 
            />
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-border">
        <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Acesso</p>
        <div onClick={() => setIsSidebarOpen(false)}>
          <SidebarItem href="/dashboard/perfil" icon={UserCircle} label="Meu Perfil" active={pathname === "/dashboard/perfil"} />
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/5 transition-all duration-200 group w-full text-left"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="font-semibold text-sm tracking-tight">Encerrar Sessão</span>
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

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-950 p-6 z-[60] lg:hidden border-r border-slate-200 dark:border-slate-800"
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
              >
                <X size="20" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col w-full min-w-0">
        {/* Header */}
        <header className="h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-30 border-b border-border">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              className="lg:hidden p-2 bg-secondary border border-border rounded-lg shadow-sm hover:bg-muted transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold tracking-tight text-foreground truncate max-w-[150px] md:max-w-none">
                  {user?.name || "Premium User"}
                </h1>
                <div className="hidden xs:flex px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground text-[9px] font-bold uppercase tracking-wider border border-border">
                  {user?.isOwner ? "Proprietário" : "Funcionário"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-1 md:gap-2">
              <NotificationCenter />
              <div className="w-px h-4 bg-border mx-2 hidden sm:block" />
              <ThemeToggle />
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-6 border-l border-border">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary flex items-center justify-center border border-white/10 shadow-sm overflow-hidden ring-2 ring-secondary">
                <span className="text-xs font-bold text-primary-foreground">
                  {user?.name?.substring(0, 2).toUpperCase() || "AD"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 lg:p-12 flex-1 w-full max-w-7xl mx-auto overflow-x-hidden animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}

function NotificationCenter() {
  const { notifications, markNotificationAsRead, clearNotifications } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={16} />;
      case 'error': return <XCircle className="text-rose-500" size={16} />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-8 h-8 md:w-9 md:h-9 rounded-lg relative hover:bg-secondary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={18} className="text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute right-0 mt-2 w-[320px] md:w-[380px] bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notificações</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive"
                  onClick={clearNotifications}
                >
                  Limpar
                </Button>
              </div>

              <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-xs font-medium text-muted-foreground">Tudo em dia por aqui.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-4 transition-colors relative group",
                          !notif.read ? "bg-muted/20" : "hover:bg-muted/10"
                        )}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">{getTypeIcon(notif.type)}</div>
                          <div className="space-y-0.5 flex-1">
                            <p className={cn("text-xs font-bold", !notif.read ? "text-foreground" : "text-muted-foreground")}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-[9px] font-medium text-muted-foreground/60 uppercase">
                              {new Date(notif.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary self-center" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
