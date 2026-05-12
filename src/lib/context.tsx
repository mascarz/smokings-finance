"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  isOwner: boolean;
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

interface Notinha {
  id: string;
  customerName: string;
  product: string;
  price: number;
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
  addNotinha: (notinha: Omit<Notinha, 'id' | 'date' | 'status'>) => void;
  updateNotinha: (id: string, notinha: Partial<Notinha>) => void;
  payNotinha: (id: string) => void;
  addEmployee: (employee: any) => void;
  addExpense: (expense: any) => void;
  addCustomer: (customer: any) => void;
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
    }
  }, [user, sales, notinhas, products, comandas, employees, expenses, customers]);

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
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setSales(prev => [newSale, ...prev]);
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
    }
  };

  // Funções de Notinhas
  const addNotinha = (notinhaData: Omit<Notinha, 'id' | 'date' | 'status'>) => {
    const newNotinha: Notinha = {
      ...notinhaData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'pendente',
    };
    setNotinhas(prev => [newNotinha, ...prev]);
  };

  const updateNotinha = (id: string, notinhaUpdate: Partial<Notinha>) => {
    setNotinhas(prev => prev.map(n => n.id === id ? { ...n, ...notinhaUpdate } : n));
  };

  const payNotinha = (id: string) => {
    const notinha = notinhas.find(n => n.id === id);
    if (notinha && notinha.status === 'pendente') {
      // Adicionar ao faturamento
      addSale({
        product: `Notinha: ${notinha.product} (${notinha.customerName})`,
        amount: notinha.price,
        quantity: 1
      });
      setNotinhas(prev => prev.map(n => n.id === id ? { ...n, status: 'pago' } : n));
    }
  };

  const addEmployee = (emp: any) => setEmployees(prev => [emp, ...prev]);
  const addExpense = (exp: any) => setExpenses(prev => [exp, ...prev]);
  const addCustomer = (cust: any) => setCustomers(prev => [cust, ...prev]);

  return (
    <AppContext.Provider value={{ 
      user, sales, notinhas, products, comandas, employees, expenses, customers,
      login, logout, addSale, 
      addProduct, updateProduct, deleteProduct,
      addComanda, addItemToComanda, updateComandaItem, payComanda,
      addNotinha, updateNotinha, payNotinha, 
      addEmployee, addExpense, addCustomer, clearAllData 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}