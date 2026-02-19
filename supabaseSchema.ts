
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; name: string; email: string; role: string; created_at: string };
        Insert: { id?: string; name: string; email: string; role?: string; created_at?: string };
        Update: { id?: string; name?: string; email?: string; role?: string; created_at?: string };
      };
      obras: {
        Row: { id: string; nome: string; endereco: string; orcamento: number; created_at: string };
        Insert: { id?: string; nome: string; endereco: string; orcamento: number; created_at?: string };
        Update: { id?: string; nome?: string; endereco?: string; orcamento?: number; created_at?: string };
      };
      materials: {
        Row: { id: string; nome: string; unidade: string; quantidade: number; valor_unitario: number };
        Insert: { id?: string; nome: string; unidade: string; quantidade: number; valor_unitario: number };
        Update: { id?: string; nome?: string; unidade?: string; quantidade?: number; valor_unitario?: number };
      };
      suppliers: {
        Row: { id: string; company_name: string; cnpj: string; status: string };
        Insert: { id?: string; company_name: string; cnpj: string; status?: string };
        Update: { id?: string; company_name?: string; cnpj?: string; status?: string };
      };
      pedidos: {
        Row: { id: string; order_code: string; obra_id: string; user_id: string; status: string; subtotal: number; created_at: string };
        Insert: { id?: string; order_code: string; obra_id: string; user_id: string; status?: string; subtotal: number; created_at?: string };
        Update: { id?: string; order_code?: string; obra_id?: string; user_id?: string; status?: string; subtotal?: number; created_at?: string };
      };
      pedido_itens: {
        Row: { id: string; order_id: string; material_id: string; quantity: number; unit_cost: number; total: number };
        Insert: { id?: string; order_id: string; material_id: string; quantity: number; unit_cost: number; total: number };
        Update: { id?: string; order_id?: string; material_id?: string; quantity?: number; unit_cost?: number; total?: number };
      };
    };
  };
}
