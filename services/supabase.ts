import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidas. Verifique o ambiente.');
}

// Cliente exportado sem generics para evitar erros de tipagem 'never' em tempo de build
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);