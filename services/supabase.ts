
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.0';
import { Database } from '../supabaseSchema';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://fkzsuhanabiovnslzwfj.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrenN1aGFuYWJpb3Zuc2x6d2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTU0MTcsImV4cCI6MjA4NjU3MTQxN30.1etpVLKmJ_jUtNe0S5Y_cHbiCzDSd-ijtwc3ML9QfEc';

// No frontend, usamos APENAS o cliente com a anon key.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
