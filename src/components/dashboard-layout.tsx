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
        "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
        active 
          ? "bg-gold-500 text-black shadow-lg shadow-gold-500/20" 
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
      )}
    >
      <Icon size={20} className={cn("transition-all duration-300 group-hover:scale-110", active ? "text-black" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
      {active && (
        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
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
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black to-slate-800 flex items-center justify-center shadow-2xl shadow-gold-500/30 border border-gold-500/40 group overflow-hidden">
          <div className="relative group-hover:scale-110 transition-transform duration-500">
            <Crown className="text-gold-500 fill-gold-500/20" size={26} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-ping" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-black text-2xl tracking-tighter leading-none text-slate-900 dark:text-white group-hover:text-gold-500 transition-colors">SMOKINGS</span>
          </div>
          <span className="text-[9px] font-black text-gold-600 tracking-[0.3em] uppercase opacity-80">Tabacaria & Lounge</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5">
        <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu Principal</p>
        {filteredMenuItems.map((item) => (
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
        <header className="h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-30 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              className="lg:hidden p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="flex flex-col">
              <h2 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] mb-0.5 truncate max-w-[120px] md:max-w-none">Premium Lounge</h2>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-xl font-black tracking-tight truncate max-w-[120px] md:max-w-none text-slate-900 dark:text-white">{user?.name || "Premium User"}</h1>
                <div className="hidden xs:block px-2 py-0.5 rounded-md bg-gold-500 text-black text-[8px] md:text-[9px] font-black uppercase tracking-wider shadow-sm">
                  {user?.isOwner ? "Proprietário" : "Funcionário"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-1 md:gap-2">
              <NotificationCenter />
              <ThemeToggle />
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-6 border-l border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold tracking-tight leading-none">{user?.name || "Admin"}</span>
                <span className="text-[10px] text-slate-400 font-medium">Online agora</span>
              </div>
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
                <UserCircle size={20} className="text-slate-400 md:size-[24px]" />
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
        className="w-9 h-9 md:w-10 md:h-10 rounded-xl relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={18} className="text-slate-500 md:size-[20px]" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full border-2 border-background flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-[320px] md:w-[400px] bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-slate-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Notificações</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500"
                  onClick={clearNotifications}
                >
                  Limpar Tudo
                </Button>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
                      <Bell size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-400">Nenhuma notificação nova</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-4 transition-colors relative group",
                          !notif.read ? "bg-slate-50/50 dark:bg-slate-800/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/20"
                        )}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1">{getTypeIcon(notif.type)}</div>
                          <div className="space-y-1 flex-1">
                            <p className={cn("text-xs font-black tracking-tight", !notif.read ? "text-slate-900 dark:text-white" : "text-slate-500")}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                              {new Date(notif.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 self-center" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/50">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Suas notificações são salvas localmente</span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
