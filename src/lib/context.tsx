"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

interface User {
  name: string;
  email: string;
  isOwner: boolean;
  ownerEmail?: string; // E-mail do dono desta conta (se for funcionário)
  permissions?: string[]; // Permissões do funcionário
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  read: boolean;
}

interface Sale {
  id: string;
  product: string;
  amount: number;
  date: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface ComandaItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Comanda {
  id: string;
  customerName: string;
  items: ComandaItem[];
  status: 'aberta' | 'paga';
  date: string;
}

interface NotinhaItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Notinha {
  id: string;
  customerName: string;
  items: NotinhaItem[];
  date: string;
  status: 'pendente' | 'pago';
}

interface AppContextType {
  user: User | null;
  sales: Sale[];
  notinhas: Notinha[];
  products: Product[];
  comandas: Comanda[];
  employees: any[];
  expenses: any[];
  customers: any[];
  notifications: Notification[];
  login: (userData: User) => void;
  logout: () => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, delta: number) => void;
  addComanda: (comanda: Omit<Comanda, 'id' | 'date' | 'status' | 'items'>) => void;
  addItemToComanda: (comandaId: string, item: ComandaItem) => void;
  updateComandaItem: (comandaId: string, productId: string, quantity: number) => void;
  payComanda: (id: string) => void;
  updateComanda: (id: string, comanda: Partial<Comanda>) => void;
  addNotinha: (notinha: Omit<Notinha, 'id' | 'date' | 'status' | 'items'>) => void;
  addItemToNotinha: (notinhaId: string, item: NotinhaItem) => void;
  updateNotinhaItem: (notinhaId: string, productId: string, quantity: number) => void;
  updateNotinha: (id: string, notinha: Partial<Notinha>) => void;
  payNotinha: (id: string) => void;
  addEmployee: (employee: any) => void;
  deleteEmployee: (id: string) => void;
  updateEmployeePermissions: (email: string, permissions: string[]) => void;
  addExpense: (expense: any) => void;
  addCustomer: (customer: any) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  clearAllData: () => void;
  registerUser: (userData: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [notinhas, setNotinhas] = useState<Notinha[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("smokings_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        const ownerPrefix = parsedUser.ownerEmail || parsedUser.email;
        
        setSales(JSON.parse(localStorage.getItem(`smokings_sales_${ownerPrefix}`) || "[]"));
        setNotinhas(JSON.parse(localStorage.getItem(`smokings_notinhas_${ownerPrefix}`) || "[]"));
        setProducts(JSON.parse(localStorage.getItem(`smokings_products_${ownerPrefix}`) || "[]"));
        setComandas(JSON.parse(localStorage.getItem(`smokings_comandas_${ownerPrefix}`) || "[]"));
        setEmployees(JSON.parse(localStorage.getItem(`smokings_employees_${ownerPrefix}`) || "[]"));
        setExpenses(JSON.parse(localStorage.getItem(`smokings_expenses_${ownerPrefix}`) || "[]"));
        setCustomers(JSON.parse(localStorage.getItem(`smokings_customers_${ownerPrefix}`) || "[]"));
        setNotifications(JSON.parse(localStorage.getItem(`smokings_notifications_${ownerPrefix}`) || "[]"));
      }
    }
  }, []);

  // Salvar dados sempre que mudarem
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem("smokings_user", JSON.stringify(user));
      
      const ownerPrefix = user.ownerEmail || user.email;
      
      localStorage.setItem(`smokings_sales_${ownerPrefix}`, JSON.stringify(sales));
      localStorage.setItem(`smokings_notinhas_${ownerPrefix}`, JSON.stringify(notinhas));
      localStorage.setItem(`smokings_products_${ownerPrefix}`, JSON.stringify(products));
      localStorage.setItem(`smokings_comandas_${ownerPrefix}`, JSON.stringify(comandas));
      localStorage.setItem(`smokings_employees_${ownerPrefix}`, JSON.stringify(employees));
      localStorage.setItem(`smokings_expenses_${ownerPrefix}`, JSON.stringify(expenses));
      localStorage.setItem(`smokings_customers_${ownerPrefix}`, JSON.stringify(customers));
      localStorage.setItem(`smokings_notifications_${ownerPrefix}`, JSON.stringify(notifications));
    }
  }, [user, sales, notinhas, products, comandas, employees, expenses, customers, notifications]);

  const login = (userData: User) => {
    setUser(userData);
    // Recarregar dados do dono ao logar
    const ownerPrefix = userData.ownerEmail || userData.email;
    if (typeof window !== "undefined") {
      setSales(JSON.parse(localStorage.getItem(`smokings_sales_${ownerPrefix}`) || "[]"));
      setNotinhas(JSON.parse(localStorage.getItem(`smokings_notinhas_${ownerPrefix}`) || "[]"));
      setProducts(JSON.parse(localStorage.getItem(`smokings_products_${ownerPrefix}`) || "[]"));
      setComandas(JSON.parse(localStorage.getItem(`smokings_comandas_${ownerPrefix}`) || "[]"));
      setEmployees(JSON.parse(localStorage.getItem(`smokings_employees_${ownerPrefix}`) || "[]"));
      setExpenses(JSON.parse(localStorage.getItem(`smokings_expenses_${ownerPrefix}`) || "[]"));
      setCustomers(JSON.parse(localStorage.getItem(`smokings_customers_${ownerPrefix}`) || "[]"));
      setNotifications(JSON.parse(localStorage.getItem(`smokings_notifications_${ownerPrefix}`) || "[]"));
      
      // Sincronizar com Supabase se houver conexão
      syncWithSupabase(ownerPrefix);
    }
  };

  const syncWithSupabase = async (ownerEmail: string) => {
    try {
      // Tentar buscar registros de usuários (funcionários) do Supabase
      const { data, error } = await supabase
        .from('smokings_registry')
        .select('*')
        .eq('ownerEmail', ownerEmail);

      if (data && !error) {
        const localRegistry = JSON.parse(localStorage.getItem("smokings_registry") || "{}");
        data.forEach(reg => {
          localRegistry[reg.email] = reg;
        });
        localStorage.setItem("smokings_registry", JSON.stringify(localRegistry));
      }
    } catch (err) {
      console.warn("Erro ao sincronizar com Supabase:", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smokings_user");
  };

  const clearAllData = () => {
    setSales([]);
    setNotinhas([]);
    setProducts([]);
    setComandas([]);
    setEmployees([]);
    setExpenses([]);
    setCustomers([]);
    setNotifications([]);
  };

  const addNotification = (notifData: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotif: Notification = {
      ...notifData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setSales(prev => [newSale, ...prev]);
    
    // Notificação automática de venda
    addNotification({
      title: "Nova Venda",
      message: `${saleData.quantity}x ${saleData.product} faturado com sucesso.`,
      type: "success"
    });
  };

  // Funções de Produtos
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      stock: productData.stock || 0,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productUpdate } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  // Funções de Comandas
  const addComanda = (comandaData: Omit<Comanda, 'id' | 'date' | 'status' | 'items'>) => {
    const newComanda: Comanda = {
      ...comandaData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'aberta',
      items: []
    };
    setComandas(prev => [newComanda, ...prev]);
  };

  const addItemToComanda = (comandaId: string, item: ComandaItem) => {
    setComandas(prev => prev.map(c => {
      if (c.id === comandaId) {
        const existingItem = c.items.find(i => i.productId === item.productId);
        if (existingItem) {
          return {
            ...c,
            items: c.items.map(i => i.productId === item.productId 
              ? { ...i, quantity: i.quantity + item.quantity } 
              : i)
          };
        }
        return { ...c, items: [...c.items, item] };
      }
      return c;
    }));
  };

  const updateComandaItem = (comandaId: string, productId: string, quantity: number) => {
    setComandas(prev => prev.map(c => {
      if (c.id === comandaId) {
        if (quantity <= 0) {
          return { ...c, items: c.items.filter(i => i.productId !== productId) };
        }
        return {
          ...c,
          items: c.items.map(i => i.productId === productId ? { ...i, quantity } : i)
        };
      }
      return c;
    }));
  };

  const payComanda = (id: string) => {
    const comanda = comandas.find(c => c.id === id);
    if (comanda && comanda.status === 'aberta') {
      // Adicionar cada item ao faturamento (sales)
      comanda.items.forEach(item => {
        addSale({
          product: item.name,
          amount: item.price,
          quantity: item.quantity
        });
      });
      setComandas(prev => prev.map(c => c.id === id ? { ...c, status: 'paga' } : c));
      
      addNotification({
        title: "Comanda Paga",
        message: `Comanda de ${comanda.customerName} finalizada.`,
        type: "success"
      });
    }
  };

  const updateComanda = (id: string, comandaUpdate: Partial<Comanda>) => {
    setComandas(prev => prev.map(c => c.id === id ? { ...c, ...comandaUpdate } : c));
  };

  // Funções de Notinhas
  const addNotinha = (notinhaData: Omit<Notinha, 'id' | 'date' | 'status' | 'items'>) => {
    const newNotinha: Notinha = {
      ...notinhaData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'pendente',
      items: []
    };
    setNotinhas(prev => [newNotinha, ...prev]);
  };

  const addItemToNotinha = (notinhaId: string, item: NotinhaItem) => {
    setNotinhas(prev => prev.map(n => {
      if (n.id === notinhaId) {
        const existingItem = n.items.find(i => i.productId === item.productId);
        if (existingItem) {
          return {
            ...n,
            items: n.items.map(i => i.productId === item.productId 
              ? { ...i, quantity: i.quantity + item.quantity } 
              : i)
          };
        }
        return { ...n, items: [...n.items, item] };
      }
      return n;
    }));
  };

  const updateNotinhaItem = (notinhaId: string, productId: string, quantity: number) => {
    setNotinhas(prev => prev.map(n => {
      if (n.id === notinhaId) {
        if (quantity <= 0) {
          return { ...n, items: n.items.filter(i => i.productId !== productId) };
        }
        return {
          ...n,
          items: n.items.map(i => i.productId === productId ? { ...i, quantity } : i)
        };
      }
      return n;
    }));
  };

  const updateNotinha = (id: string, notinhaUpdate: Partial<Notinha>) => {
    setNotinhas(prev => prev.map(n => n.id === id ? { ...n, ...notinhaUpdate } : n));
  };

  const payNotinha = (id: string) => {
    const notinha = notinhas.find(n => n.id === id);
    if (notinha && notinha.status === 'pendente') {
      // Adicionar cada item ao faturamento
      notinha.items.forEach(item => {
        addSale({
          product: `Notinha: ${item.name} (${notinha.customerName})`,
          amount: item.price,
          quantity: item.quantity
        });
      });
      setNotinhas(prev => prev.map(n => n.id === id ? { ...n, status: 'pago' } : n));

      addNotification({
        title: "Notinha Paga",
        message: `Notinha de ${notinha.customerName} paga com sucesso.`,
        type: "success"
      });
    }
  };

  const addEmployee = (emp: any) => {
    const normalizedEmail = emp.email.toLowerCase().trim();
    // Garante que o funcionário tenha ao menos a permissão de vendas
    const permissions = emp.permissions && emp.permissions.length > 0 ? emp.permissions : ["vendas"];
    const newEmp = { ...emp, email: normalizedEmail, permissions };
    
    setEmployees(prev => {
      const exists = prev.find(e => e.email === normalizedEmail);
      if (exists) return prev;
      return [newEmp, ...prev];
    });
    
    // Registrar funcionário no sistema global (localStorage) para permitir login
    if (typeof window !== "undefined" && user) {
      const registry = JSON.parse(localStorage.getItem("smokings_registry") || "{}");
      const employeeData = {
        name: emp.name,
        email: normalizedEmail,
        password: "123", // Senha padrão obrigatória
        isOwner: false,
        ownerEmail: user.email.toLowerCase().trim(), // Vincula ao e-mail do dono atual
        permissions: permissions
      };
      registry[normalizedEmail] = employeeData;
      localStorage.setItem("smokings_registry", JSON.stringify(registry));
      
      // Salvar no Supabase para acesso em outros aparelhos
      saveToSupabaseRegistry(employeeData);
      
      // DEBUG: Mostrar no console para conferência
      console.log("Funcionário registrado no sistema:", registry[normalizedEmail]);
    }

    addNotification({
      title: "Novo Funcionário",
      message: `${emp.name} cadastrado. Login: ${normalizedEmail} | Senha: 123`,
      type: "info"
    });
  };

  const saveToSupabaseRegistry = async (userData: any) => {
    try {
      await supabase.from('smokings_registry').upsert([userData]);
    } catch (err) {
      console.warn("Erro ao salvar no Supabase (verifique se a tabela existe):", err);
    }
  };

  const deleteEmployee = (id: string) => {
    const employeeToDelete = employees.find(e => e.id === id);
    if (employeeToDelete && typeof window !== "undefined") {
      const registry = JSON.parse(localStorage.getItem("smokings_registry") || "{}");
      const normalizedEmail = employeeToDelete.email.toLowerCase().trim();
      delete registry[normalizedEmail];
      localStorage.setItem("smokings_registry", JSON.stringify(registry));
    }
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    addNotification({
      title: "Funcionário Removido",
      message: "O acesso do funcionário foi revogado.",
      type: "warning"
    });
  };

  const registerUser = (userData: any) => {
    if (typeof window !== "undefined") {
      const registry = JSON.parse(localStorage.getItem("smokings_registry") || "{}");
      const normalizedEmail = userData.email.toLowerCase().trim();
      registry[normalizedEmail] = {
        ...userData,
        email: normalizedEmail,
        isOwner: true,
        ownerEmail: normalizedEmail
      };
      localStorage.setItem("smokings_registry", JSON.stringify(registry));
    }
  };

  const updateEmployeePermissions = (email: string, permissions: string[]) => {
    const normalizedEmail = email.toLowerCase().trim();
    setEmployees(prev => prev.map(emp => emp.email === normalizedEmail ? { ...emp, permissions } : emp));
    
    // Atualizar no registro global para refletir no login
    if (typeof window !== "undefined") {
      const registry = JSON.parse(localStorage.getItem("smokings_registry") || "{}");
      if (registry[normalizedEmail]) {
        registry[normalizedEmail].permissions = permissions;
        localStorage.setItem("smokings_registry", JSON.stringify(registry));
      }
    }

    addNotification({
      title: "Permissões Atualizadas",
      message: `As permissões para ${normalizedEmail} foram modificadas.`,
      type: "warning"
    });
  };

  const addExpense = (exp: any) => {
    setExpenses(prev => [exp, ...prev]);
    addNotification({
      title: "Nova Despesa",
      message: `Gasto de ${exp.amount} registrado em ${exp.category}.`,
      type: "warning"
    });
  };

  const addCustomer = (cust: any) => setCustomers(prev => [cust, ...prev]);

  return (
    <AppContext.Provider value={{ 
      user, sales, notinhas, products, comandas, employees, expenses, customers, notifications,
      login, logout, addSale, 
      addProduct, updateProduct, deleteProduct, updateStock,
      addComanda, addItemToComanda, updateComandaItem, payComanda, updateComanda,
      addNotinha, addItemToNotinha, updateNotinhaItem, updateNotinha, payNotinha, 
      addEmployee, deleteEmployee, updateEmployeePermissions, addExpense, addCustomer,
      addNotification, markNotificationAsRead, clearNotifications, clearAllData, registerUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
