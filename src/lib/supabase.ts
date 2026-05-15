import { createClient } from "@supabase/supabase-js";

// Essas variáveis devem ser configuradas no arquivo .env.local ou no painel do Render
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("AVISO: Chaves do Supabase não encontradas. Verifique as variáveis de ambiente.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);

export type Profile = {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'employee';
  phone?: string;
  permissions: {
    view: string[];
    edit: string[];
    delete: string[];
    manage: string[];
  };
};

export type Transaction = {
  id: string;
  type: 'inflow' | 'outflow';
  amount: number;
  category: string;
  description: string;
  date: string;
  created_by: string;
};

export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  vip_status: boolean;
  notes?: string;
  total_spent: number;
  last_visit: string;
};
