"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  isOwner: boolean;
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
  updateEmployeePermissions: (email: string, permissions: string[]) => void;
  addExpense: (expense: any) => void;
  addCustomer: (customer: any) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  clearAllData: () => void;
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
      if (savedUser) setUser(JSON.parse(savedUser));
      
      setSales(JSON.parse(localStorage.getItem("smokings_sales") || "[]"));
      setNotinhas(JSON.parse(localStorage.getItem("smokings_notinhas") || "[]"));
      setProducts(JSON.parse(localStorage.getItem("smokings_products") || "[]"));
      setComandas(JSON.parse(localStorage.getItem("smokings_comandas") || "[]"));
      setEmployees(JSON.parse(localStorage.getItem("smokings_employees") || "[]"));
      setExpenses(JSON.parse(localStorage.getItem("smokings_expenses") || "[]"));
      setCustomers(JSON.parse(localStorage.getItem("smokings_customers") || "[]"));
      setNotifications(JSON.parse(localStorage.getItem("smokings_notifications") || "[]"));
    }
  }, []);

  // Salvar dados sempre que mudarem
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) localStorage.setItem("smokings_user", JSON.stringify(user));
      localStorage.setItem("smokings_sales", JSON.stringify(sales));
      localStorage.setItem("smokings_notinhas", JSON.stringify(notinhas));
      localStorage.setItem("smokings_products", JSON.stringify(products));
      localStorage.setItem("smokings_comandas", JSON.stringify(comandas));
      localStorage.setItem("smokings_employees", JSON.stringify(employees));
      localStorage.setItem("smokings_expenses", JSON.stringify(expenses));
      localStorage.setItem("smokings_customers", JSON.stringify(customers));
      localStorage.setItem("smokings_notifications", JSON.stringify(notifications));
    }
  }, [user, sales, notinhas, products, comandas, employees, expenses, customers, notifications]);

  const login = (userData: User) => {
    setUser(userData);
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
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productUpdate } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
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
    setEmployees(prev => [emp, ...prev]);
    addNotification({
      title: "Novo Funcionário",
      message: `${emp.name} adicionado à equipe.`,
      type: "info"
    });
  };

  const updateEmployeePermissions = (email: string, permissions: string[]) => {
    setEmployees(prev => prev.map(emp => emp.email === email ? { ...emp, permissions } : emp));
    addNotification({
      title: "Permissões Atualizadas",
      message: `As permissões para ${email} foram modificadas.`,
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
      addProduct, updateProduct, deleteProduct,
      addComanda, addItemToComanda, updateComandaItem, payComanda, updateComanda,
      addNotinha, addItemToNotinha, updateNotinhaItem, updateNotinha, payNotinha, 
      addEmployee, updateEmployeePermissions, addExpense, addCustomer,
      addNotification, markNotificationAsRead, clearNotifications, clearAllData 
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
