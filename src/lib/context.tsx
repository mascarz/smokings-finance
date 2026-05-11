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
  employees: any[];
  expenses: any[];
  customers: any[];
  login: (userData: User) => void;
  logout: () => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  addNotinha: (notinha: Omit<Notinha, 'id' | 'date' | 'status'>) => void;
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
  const [employees, setEmployees] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("smokings_user");
      if (savedUser) setUser(JSON.parse(savedUser));
      
      const savedSales = localStorage.getItem("smokings_sales");
      if (savedSales) setSales(JSON.parse(savedSales));
      
      const savedNotinhas = localStorage.getItem("smokings_notinhas");
      if (savedNotinhas) setNotinhas(JSON.parse(savedNotinhas));
      
      const savedEmployees = localStorage.getItem("smokings_employees");
      if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
      
      const savedExpenses = localStorage.getItem("smokings_expenses");
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      
      const savedCustomers = localStorage.getItem("smokings_customers");
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  // Salvar dados sempre que mudarem (independente de estar logado)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) localStorage.setItem("smokings_user", JSON.stringify(user));
      localStorage.setItem("smokings_sales", JSON.stringify(sales));
      localStorage.setItem("smokings_notinhas", JSON.stringify(notinhas));
      localStorage.setItem("smokings_employees", JSON.stringify(employees));
      localStorage.setItem("smokings_expenses", JSON.stringify(expenses));
      localStorage.setItem("smokings_customers", JSON.stringify(customers));
    }
  }, [user, sales, notinhas, employees, expenses, customers]);

  const login = (userData: User) => {
    setUser(userData);
    // Se for um novo usuário (simulado pelo registro), os estados já estarão vazios
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smokings_user");
  };

  const clearAllData = () => {
    setSales([]);
    setNotinhas([]);
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

  const addNotinha = (notinhaData: Omit<Notinha, 'id' | 'date' | 'status'>) => {
    const newNotinha: Notinha = {
      ...notinhaData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'pendente',
    };
    setNotinhas(prev => [newNotinha, ...prev]);
  };

  const payNotinha = (id: string) => {
    setNotinhas(prev => prev.map(n => n.id === id ? { ...n, status: 'pago' } : n));
  };

  const addEmployee = (emp: any) => setEmployees(prev => [emp, ...prev]);
  const addExpense = (exp: any) => setExpenses(prev => [exp, ...prev]);
  const addCustomer = (cust: any) => setCustomers(prev => [cust, ...prev]);

  return (
    <AppContext.Provider value={{ 
      user, sales, notinhas, employees, expenses, customers,
      login, logout, addSale, addNotinha, payNotinha, 
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
