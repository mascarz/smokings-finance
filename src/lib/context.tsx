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
  observation?: string;
  owner_email?: string;
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
  observation?: string;
  owner_email?: string;
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
  forceSyncEmployees: () => Promise<boolean>;
    syncAllDataToCloud: () => Promise<boolean>;
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
        
        const ownerPrefix = (parsedUser.ownerEmail || parsedUser.email).toLowerCase().trim();
        
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

  // 1. Ativar Escuta em Tempo Real (Realtime)
  useEffect(() => {
    if (user) {
      const ownerPrefix = (user.isOwner ? user.email : (user.ownerEmail || user.email)).toLowerCase().trim();
      
      console.log("Ativando Realtime para o dono:", ownerPrefix);

      const channel = supabase
        .channel(`changes_${ownerPrefix}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sales', filter: `owner_email=eq.${ownerPrefix}` },
          (payload) => {
            console.log("REALTIME: Venda alterada!", payload);
            syncWithSupabase(ownerPrefix);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products', filter: `owner_email=eq.${ownerPrefix}` },
          (payload) => {
            console.log("REALTIME: Produto alterado!", payload);
            syncWithSupabase(ownerPrefix);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'comandas', filter: `owner_email=eq.${ownerPrefix}` },
          (payload) => {
            console.log("REALTIME: Comanda alterada!", payload);
            syncWithSupabase(ownerPrefix);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notinhas', filter: `owner_email=eq.${ownerPrefix}` },
          (payload) => {
            console.log("REALTIME: Notinha alterada!", payload);
            syncWithSupabase(ownerPrefix);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'expenses', filter: `owner_email=eq.${ownerPrefix}` },
          (payload) => {
            console.log("REALTIME: Despesa alterada!", payload);
            syncWithSupabase(ownerPrefix);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'customers', filter: `owner_email=eq.${ownerPrefix}` },
          (payload) => {
            console.log("REALTIME: Cliente alterado!", payload);
            syncWithSupabase(ownerPrefix);
          }
        )
        .subscribe((status) => {
          console.log(`Status do canal Realtime (${ownerPrefix}):`, status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // Salvar dados sempre que mudarem
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem("smokings_user", JSON.stringify(user));
      
      const ownerPrefix = (user.ownerEmail || user.email).toLowerCase().trim();
      
      localStorage.setItem(`smokings_sales_${ownerPrefix}`, JSON.stringify(sales));
      localStorage.setItem(`smokings_notinhas_${ownerPrefix}`, JSON.stringify(notinhas));
      localStorage.setItem(`smokings_products_${ownerPrefix}`, JSON.stringify(products));
      localStorage.setItem(`smokings_comandas_${ownerPrefix}`, JSON.stringify(comandas));
      localStorage.setItem(`smokings_employees_${ownerPrefix}`, JSON.stringify(employees));
      localStorage.setItem(`smokings_expenses_${ownerPrefix}`, JSON.stringify(expenses));
      localStorage.setItem(`smokings_customers_${ownerPrefix}`, JSON.stringify(customers));
      localStorage.setItem(`smokings_notifications_${ownerPrefix}`, JSON.stringify(notifications));
      
      // Auto-sincronizar funcionários com o Supabase quando o dono está logado
      if (user.isOwner && employees.length > 0) {
        const syncEmployees = async () => {
          try {
            const employeesToSync = employees.map(emp => ({
              name: emp.name,
              email: emp.email.toLowerCase().trim(),
              password: emp.password || "123",
              isOwner: false,
              ownerEmail: user.email.toLowerCase().trim(),
              permissions: emp.permissions || ["vendas"]
            }));

            for (const empData of employeesToSync) {
              await saveToSupabaseRegistry(empData);
            }
          } catch (err) {
            console.warn("Erro na auto-sincronização de equipe:", err);
          }
        };
        syncEmployees();
      }
    }
  }, [user, sales, notinhas, products, comandas, employees, expenses, customers, notifications]);

  const login = (userData: User) => {
    setUser(userData);
    // Recarregar dados do dono ao logar
    // IMPORTANTE: Se for funcionário, usar SEMPRE o ownerEmail para carregar os dados
    const ownerPrefix = userData.isOwner ? userData.email.toLowerCase().trim() : (userData.ownerEmail?.toLowerCase().trim() || userData.email.toLowerCase().trim());
    
    if (typeof window !== "undefined") {
      console.log("Logado como:", userData.email, "| Carregando dados de:", ownerPrefix);
      
      setSales(JSON.parse(localStorage.getItem(`smokings_sales_${ownerPrefix}`) || "[]"));
      setNotinhas(JSON.parse(localStorage.getItem(`smokings_notinhas_${ownerPrefix}`) || "[]"));
      setProducts(JSON.parse(localStorage.getItem(`smokings_products_${ownerPrefix}`) || "[]"));
      setComandas(JSON.parse(localStorage.getItem(`smokings_comandas_${ownerPrefix}`) || "[]"));
      setEmployees(JSON.parse(localStorage.getItem(`smokings_employees_${ownerPrefix}`) || "[]"));
      setExpenses(JSON.parse(localStorage.getItem(`smokings_expenses_${ownerPrefix}`) || "[]"));
      setCustomers(JSON.parse(localStorage.getItem(`smokings_customers_${ownerPrefix}`) || "[]"));
      setNotifications(JSON.parse(localStorage.getItem(`smokings_notifications_${ownerPrefix}`) || "[]"));
      
      syncWithSupabase(ownerPrefix);
    }
  };

  const syncWithSupabase = async (ownerEmail: string) => {
    try {
      const normalizedOwnerEmail = ownerEmail.toLowerCase().trim();
      console.log("SINCRONIZANDO: Buscando dados da nuvem para:", normalizedOwnerEmail);

      // 1. Sincronizar PRODUTOS
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('owner_email', normalizedOwnerEmail);

      if (!productsError) {
        console.log(`- Produtos: ${productsData?.length || 0}`);
        const finalProducts = productsData || [];
        setProducts(finalProducts);
        localStorage.setItem(`smokings_products_${normalizedOwnerEmail}`, JSON.stringify(finalProducts));
      }

      // 2. Sincronizar VENDAS
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('owner_email', normalizedOwnerEmail)
        .order('date', { ascending: false });

      if (!salesError) {
        console.log(`- Vendas: ${salesData?.length || 0}`);
        const finalSales = salesData || [];
        setSales(finalSales);
        localStorage.setItem(`smokings_sales_${normalizedOwnerEmail}`, JSON.stringify(finalSales));
      }

      // 3. Sincronizar COMANDAS
      const { data: comandasData, error: comandasError } = await supabase
        .from('comandas')
        .select('*')
        .eq('owner_email', normalizedOwnerEmail);

      if (!comandasError) {
        console.log(`- Comandas: ${comandasData?.length || 0}`);
        const finalComandas = (comandasData || []).map(c => ({
          ...c,
          customerName: c.customerName || c.customername,
          tableNumber: c.tableNumber || c.tablenumber
        }));
        setComandas(finalComandas);
        localStorage.setItem(`smokings_comandas_${normalizedOwnerEmail}`, JSON.stringify(finalComandas));
      }

      // 4. Sincronizar NOTINHAS
      const { data: notinhasData, error: notinhasError } = await supabase
        .from('notinhas')
        .select('*')
        .eq('owner_email', normalizedOwnerEmail);

      if (!notinhasError) {
        console.log(`- Notinhas: ${notinhasData?.length || 0}`);
        const finalNotinhas = (notinhasData || []).map(n => ({
          ...n,
          customerName: n.customerName || n.customername
        }));
        setNotinhas(finalNotinhas);
        localStorage.setItem(`smokings_notinhas_${normalizedOwnerEmail}`, JSON.stringify(finalNotinhas));
      }

      // 5. Sincronizar CLIENTES
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('owner_email', normalizedOwnerEmail);
        
      if (!customersError) {
        console.log(`- Clientes: ${customersData?.length || 0}`);
        const finalCustomers = customersData || [];
        setCustomers(finalCustomers);
        localStorage.setItem(`smokings_customers_${normalizedOwnerEmail}`, JSON.stringify(finalCustomers));
      }

      // 6. Sincronizar DESPESAS
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('owner_email', normalizedOwnerEmail);
        
      if (!expensesError) {
        console.log(`- Despesas: ${expensesData?.length || 0}`);
        const finalExpenses = expensesData || [];
        setExpenses(finalExpenses);
        localStorage.setItem(`smokings_expenses_${normalizedOwnerEmail}`, JSON.stringify(finalExpenses));
      }

      return true;
    } catch (err) {
      console.warn("Erro ao sincronizar com Supabase:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smokings_user");
  };

  const clearAllData = async () => {
    if (typeof window !== "undefined") {
      // Limpa TUDO o que começa com smokings_
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("smokings_")) {
          localStorage.removeItem(key);
        }
      });
    }
    
    // Se estiver logado e for dono, tenta limpar na nuvem também
    if (user && (user.isOwner || user.email === 'smokings@smokings.com')) {
      const ownerEmail = user.email.toLowerCase().trim();
      console.log("LIMPANDO DADOS NA NUVEM PARA:", ownerEmail);
      
      try {
        await Promise.all([
          supabase.from('sales').delete().eq('owner_email', ownerEmail),
          supabase.from('products').delete().eq('owner_email', ownerEmail),
          supabase.from('comandas').delete().eq('owner_email', ownerEmail),
          supabase.from('notinhas').delete().eq('owner_email', ownerEmail),
          supabase.from('customers').delete().eq('owner_email', ownerEmail),
          supabase.from('expenses').delete().eq('owner_email', ownerEmail)
        ]);
        console.log("Nuvem limpa com sucesso.");
      } catch (err) {
        console.error("Erro ao limpar nuvem:", err);
      }
    }

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

  const forceSyncEmployees = async () => {
    if (!user || !user.isOwner) return false;
    
    try {
      const employeesToSync = employees.map(emp => ({
        name: emp.name,
        email: emp.email.toLowerCase().trim(),
        password: "123",
        isOwner: false,
        ownerEmail: user.email.toLowerCase().trim(),
        permissions: emp.permissions || ["vendas"]
      }));

      for (const empData of employeesToSync) {
        await saveToSupabaseRegistry(empData);
      }
      return true;
    } catch (err) {
      console.error("Erro na sincronização forçada:", err);
      return false;
    }
  };

  const syncAllDataToCloud = async () => {
    // Permitir se for dono OU se for o e-mail mestre
    if (!user || (!user.isOwner && user.email !== 'smokings@smokings.com')) {
      console.warn("Usuário sem permissão de dono para sincronizar.");
      return false;
    }
    
    const ownerEmail = user.email.toLowerCase().trim();

    try {
      console.log("Iniciando sincronização total para:", ownerEmail);

      // 1. Sincronizar Produtos
      if (products.length > 0) {
        console.log("Sincronizando produtos...");
        const { error: pError } = await supabase.from('products').upsert(
          products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            stock: p.stock,
            owner_email: ownerEmail
          }))
        );
        if (pError) throw new Error(`Erro Produtos: ${pError.message}`);
      }

      // 2. Sincronizar Vendas
      if (sales.length > 0) {
        console.log("Sincronizando vendas...");
        const { error: sError } = await supabase.from('sales').upsert(
          sales.map(s => ({
            id: s.id,
            product: s.product,
            amount: s.amount,
            quantity: s.quantity,
            date: s.date,
            owner_email: ownerEmail
          }))
        );
        if (sError) throw new Error(`Erro Vendas: ${sError.message}`);
      }

      // 3. Sincronizar Comandas
      if (comandas.length > 0) {
        console.log("Sincronizando comandas...");
        const { error: cError } = await supabase.from('comandas').upsert(
          comandas.map(c => ({ 
            id: c.id,
            customerName: c.customerName,
            tableNumber: c.tableNumber,
            items: c.items,
            status: c.status,
            date: c.date,
            owner_email: ownerEmail
          }))
        );
        if (cError) throw new Error(`Erro Comandas: ${cError.message}`);
      }

      // 4. Sincronizar Notinhas
      if (notinhas.length > 0) {
        console.log("Sincronizando notinhas...");
        const { error: nError } = await supabase.from('notinhas').upsert(
          notinhas.map(n => ({ 
            id: n.id,
            customerName: n.customerName,
            items: n.items,
            status: n.status,
            date: n.date,
            owner_email: ownerEmail
          }))
        );
        if (nError) throw new Error(`Erro Notinhas: ${nError.message}`);
      }

      // 5. Sincronizar Clientes
      if (customers.length > 0) {
        console.log("Sincronizando clientes...");
        const { error: custError } = await supabase.from('customers').upsert(
          customers.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            isVip: c.isVip,
            owner_email: ownerEmail
          }))
        );
        if (custError) throw new Error(`Erro Clientes: ${custError.message}`);
      }

      // 6. Sincronizar Despesas
      if (expenses.length > 0) {
        console.log("Sincronizando despesas...");
        const { error: expError } = await supabase.from('expenses').upsert(
          expenses.map(e => ({
            id: e.id || Math.random().toString(36).substr(2, 9),
            description: e.description,
            amount: e.amount,
            category: e.category,
            date: e.date || new Date().toISOString(),
            owner_email: ownerEmail
          }))
        );
        if (expError) throw new Error(`Erro Despesas: ${expError.message}`);
      }

      return true;
    } catch (err: any) {
      console.error("FALHA NA SINCRONIZAÇÃO:", err.message);
      return false;
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addSale = async (saleData: Omit<Sale, 'id' | 'date'>) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    const newSale: Sale = {
      ...saleData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      owner_email: ownerPrefix
    };
    
    // Atualiza local
    setSales(prev => [newSale, ...prev]);
    
    // Envia para o Supabase IMEDIATAMENTE
    try {
      await supabase.from('sales').upsert([newSale]);
    } catch (err) {
      console.warn("Erro ao salvar venda na nuvem:", err);
    }
    
    addNotification({
      title: "Nova Venda",
      message: `${saleData.quantity}x ${saleData.product} faturado com sucesso.`,
      type: "success"
    });
  };

  // Funções de Produtos
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      stock: productData.stock || 0,
    };
    
    setProducts(prev => [newProduct, ...prev]);

    try {
      await supabase.from('products').upsert([{
        ...newProduct,
        owner_email: ownerPrefix
      }]);
    } catch (err) {
      console.warn("Erro ao salvar produto na nuvem:", err);
    }
  };

  const updateProduct = async (id: string, productUpdate: Partial<Product>) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...productUpdate } : p);
      const product = updated.find(p => p.id === id);
      if (product) {
        supabase.from('products').upsert([{
          ...product,
          owner_email: ownerPrefix
        }]).then(({error}) => {
          if (error) console.error("Erro ao atualizar produto na nuvem:", error);
        });
      }
      return updated;
    });
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.error("Erro ao deletar produto na nuvem:", err);
    }
  };

  const updateStock = async (id: string, delta: number) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          const updatedProduct = { ...p, stock: newStock };
          
          supabase.from('products').upsert([{
            ...updatedProduct,
            owner_email: ownerPrefix
          }]).then(({error}) => {
            if (error) console.error("Erro ao atualizar estoque na nuvem:", error);
          });
          
          return updatedProduct;
        }
        return p;
      });
      return updated;
    });
  };

  // Funções de Comandas
  const addComanda = async (comandaData: Omit<Comanda, 'id' | 'date' | 'status' | 'items'>) => {
    const ownerPrefix = (user?.isOwner ? user.email : (user?.ownerEmail || user?.email))?.toLowerCase().trim();
    
    const newComanda: Comanda = {
      ...comandaData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'aberta',
      items: [],
      observation: comandaData.observation || "",
      owner_email: ownerPrefix
    };
    
    setComandas(prev => [newComanda, ...prev]);

    try {
      await supabase.from('comandas').upsert([newComanda]);
    } catch (err) {
      console.warn("Erro ao salvar comanda na nuvem:", err);
    }
  };

  const addItemToComanda = async (comandaId: string, item: ComandaItem) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    setComandas(prev => {
      const newComandas = prev.map(c => {
        if (c.id === comandaId) {
          const existingItem = c.items.find(i => i.productId === item.productId);
          let newItems;
          if (existingItem) {
            newItems = c.items.map(i => i.productId === item.productId 
              ? { ...i, quantity: i.quantity + item.quantity } 
              : i);
          } else {
            newItems = [...c.items, item];
          }
          const updatedComanda = { ...c, items: newItems, owner_email: ownerPrefix };
          
          // Sync to Supabase
          supabase.from('comandas').upsert([updatedComanda]).then(({error}) => {
            if (error) console.error("Erro ao atualizar itens da comanda:", error);
          });
          
          return updatedComanda;
        }
        return c;
      });
      return newComandas;
    });
  };

  const updateComandaItem = async (comandaId: string, productId: string, quantity: number) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    setComandas(prev => {
      const newComandas = prev.map(c => {
        if (c.id === comandaId) {
          let newItems;
          if (quantity <= 0) {
            newItems = c.items.filter(i => i.productId !== productId);
          } else {
            newItems = c.items.map(i => i.productId === productId ? { ...i, quantity } : i);
          }
          const updatedComanda = { ...c, items: newItems, owner_email: ownerPrefix };
          
          // Sync to Supabase
          supabase.from('comandas').upsert([updatedComanda]).then(({error}) => {
            if (error) console.error("Erro ao atualizar quantidade do item:", error);
          });
          
          return updatedComanda;
        }
        return c;
      });
      return newComandas;
    });
  };

  const payComanda = async (id: string) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
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
      
      const updatedComanda = { ...comanda, status: 'paga', owner_email: ownerPrefix };
      setComandas(prev => prev.map(c => c.id === id ? updatedComanda : c));
      
      try {
        await supabase.from('comandas').upsert([updatedComanda]);
      } catch (err) {
        console.error("Erro ao pagar comanda na nuvem:", err);
      }

      addNotification({
        title: "Comanda Paga",
        message: `Comanda de ${comanda.customerName} finalizada.`,
        type: "success"
      });
    }
  };

  const updateComanda = async (id: string, comandaUpdate: Partial<Comanda>) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    setComandas(prev => {
      const newComandas = prev.map(c => {
        if (c.id === id) {
          const updatedComanda = { ...c, ...comandaUpdate, owner_email: ownerPrefix };
          supabase.from('comandas').upsert([updatedComanda]).then(({error}) => {
            if (error) console.error("Erro ao atualizar comanda:", error);
          });
          return updatedComanda;
        }
        return c;
      });
      return newComandas;
    });
  };

  // Funções de Notinhas
  const addNotinha = async (notinhaData: Omit<Notinha, 'id' | 'date' | 'status' | 'items'>) => {
    const ownerPrefix = (user?.isOwner ? user.email : (user?.ownerEmail || user?.email))?.toLowerCase().trim();
    
    const newNotinha: Notinha = {
      ...notinhaData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'pendente',
      items: [],
      observation: notinhaData.observation || "",
      owner_email: ownerPrefix
    };
    
    setNotinhas(prev => [newNotinha, ...prev]);

    try {
      await supabase.from('notinhas').upsert([newNotinha]);
    } catch (err) {
      console.warn("Erro ao salvar notinha na nuvem:", err);
    }
  };

  const addItemToNotinha = async (notinhaId: string, item: NotinhaItem) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    setNotinhas(prev => {
      const newNotinhas = prev.map(n => {
        if (n.id === notinhaId) {
          const existingItem = n.items.find(i => i.productId === item.productId);
          let newItems;
          if (existingItem) {
            newItems = n.items.map(i => i.productId === item.productId 
              ? { ...i, quantity: i.quantity + item.quantity } 
              : i);
          } else {
            newItems = [...n.items, item];
          }
          const updatedNotinha = { ...n, items: newItems, owner_email: ownerPrefix };
          
          supabase.from('notinhas').upsert([updatedNotinha]).then(({error}) => {
            if (error) console.error("Erro ao atualizar itens da notinha:", error);
          });
          
          return updatedNotinha;
        }
        return n;
      });
      return newNotinhas;
    });
  };

  const updateNotinhaItem = async (notinhaId: string, productId: string, quantity: number) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    setNotinhas(prev => {
      const newNotinhas = prev.map(n => {
        if (n.id === notinhaId) {
          let newItems;
          if (quantity <= 0) {
            newItems = n.items.filter(i => i.productId !== productId);
          } else {
            newItems = n.items.map(i => i.productId === productId ? { ...i, quantity } : i);
          }
          const updatedNotinha = { ...n, items: newItems, owner_email: ownerPrefix };
          
          supabase.from('notinhas').upsert([updatedNotinha]).then(({error}) => {
            if (error) console.error("Erro ao atualizar quantidade da notinha:", error);
          });
          
          return updatedNotinha;
        }
        return n;
      });
      return newNotinhas;
    });
  };

  const updateNotinha = async (id: string, notinhaUpdate: Partial<Notinha>) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    setNotinhas(prev => {
      const newNotinhas = prev.map(n => {
        if (n.id === id) {
          const updatedNotinha = { ...n, ...notinhaUpdate, owner_email: ownerPrefix };
          supabase.from('notinhas').upsert([updatedNotinha]).then(({error}) => {
            if (error) console.error("Erro ao atualizar notinha:", error);
          });
          return updatedNotinha;
        }
        return n;
      });
      return newNotinhas;
    });
  };

  const payNotinha = async (id: string) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
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
      
      const updatedNotinha = { ...notinha, status: 'pago', owner_email: ownerPrefix };
      setNotinhas(prev => prev.map(n => n.id === id ? updatedNotinha : n));

      try {
        await supabase.from('notinhas').upsert([updatedNotinha]);
      } catch (err) {
        console.error("Erro ao pagar notinha na nuvem:", err);
      }

      addNotification({
        title: "Notinha Paga",
        message: `Notinha de ${notinha.customerName} paga com sucesso.`,
        type: "success"
      });
    }
  };

  const addEmployee = async (emp: any) => {
    const normalizedEmail = emp.email.toLowerCase().trim();
    const permissions = emp.permissions && emp.permissions.length > 0 ? emp.permissions : ["vendas"];
    const newEmp = { ...emp, email: normalizedEmail, permissions };
    
    setEmployees(prev => {
      const exists = prev.find(e => e.email === normalizedEmail);
      if (exists) return prev;
      return [newEmp, ...prev];
    });
    
    // Registrar funcionário no sistema global (localStorage)
    if (typeof window !== "undefined" && user) {
      const registry = JSON.parse(localStorage.getItem("smokings_registry") || "{}");
      const employeeData = {
        name: emp.name,
        email: normalizedEmail,
        password: "123", // Senha padrão obrigatória
        isOwner: false,
        ownerEmail: user.email.toLowerCase().trim(),
        permissions: permissions
      };
      registry[normalizedEmail] = employeeData;
      localStorage.setItem("smokings_registry", JSON.stringify(registry));
      
      // Salvar no Supabase para acesso em outros aparelhos
      await saveToSupabaseRegistry(employeeData);
      
      console.log("Funcionário registrado com sucesso:", normalizedEmail);
    }

    addNotification({
      title: "Novo Funcionário",
      message: `${emp.name} cadastrado. Login: ${normalizedEmail} | Senha: 123`,
      type: "info"
    });
  };

  const saveToSupabaseRegistry = async (userData: any) => {
    try {
      const { error } = await supabase.from('smokings_registry').upsert([userData]);
      if (error) throw error;
      console.log("Dados salvos no Supabase com sucesso.");
    } catch (err) {
      console.error("ERRO ao salvar no Supabase:", err);
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

  const registerUser = async (userData: any) => {
    if (typeof window !== "undefined") {
      const normalizedEmail = userData.email.toLowerCase().trim();
      const registryData = {
        ...userData,
        email: normalizedEmail,
        isOwner: true,
        ownerEmail: normalizedEmail
      };
      
      const registry = JSON.parse(localStorage.getItem("smokings_registry") || "{}");
      registry[normalizedEmail] = registryData;
      localStorage.setItem("smokings_registry", JSON.stringify(registry));
      
      await saveToSupabaseRegistry(registryData);
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

  const addExpense = async (exp: any) => {
    const ownerPrefix = user?.isOwner ? user.email.toLowerCase().trim() : (user?.ownerEmail?.toLowerCase().trim() || user?.email.toLowerCase().trim());
    
    const newExpense = {
      ...exp,
      id: exp.id || Math.random().toString(36).substr(2, 9),
      date: exp.date || new Date().toISOString(),
      owner_email: ownerPrefix
    };

    setExpenses(prev => [newExpense, ...prev]);

    try {
      await supabase.from('expenses').upsert([newExpense]);
    } catch (err) {
      console.warn("Erro ao salvar despesa na nuvem:", err);
    }

    addNotification({
      title: "Nova Despesa",
      message: `Gasto de ${exp.amount} registrado em ${exp.category}.`,
      type: "warning"
    });
  };

  const addCustomer = async (cust: any) => {
    const ownerPrefix = (user?.isOwner ? user.email : (user?.ownerEmail || user?.email))?.toLowerCase().trim();
    
    const newCustomer = {
      ...cust,
      id: cust.id || Math.random().toString(36).substr(2, 9),
      owner_email: ownerPrefix
    };

    setCustomers(prev => [newCustomer, ...prev]);

    try {
      await supabase.from('customers').upsert([newCustomer]);
    } catch (err) {
      console.warn("Erro ao salvar cliente na nuvem:", err);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, sales, notinhas, products, comandas, employees, expenses, customers, notifications,
      login, logout, addSale, 
      addProduct, updateProduct, deleteProduct, updateStock,
      addComanda, addItemToComanda, updateComandaItem, payComanda, updateComanda,
      addNotinha, addItemToNotinha, updateNotinhaItem, updateNotinha, payNotinha, 
      addEmployee, deleteEmployee, updateEmployeePermissions, addExpense, addCustomer,
      addNotification, markNotificationAsRead, clearNotifications, clearAllData, registerUser,
       forceSyncEmployees, syncAllDataToCloud
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
