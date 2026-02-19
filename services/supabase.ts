import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabaseSchema';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidas.');
}

// No frontend, usamos APENAS o cliente com a anon key.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);