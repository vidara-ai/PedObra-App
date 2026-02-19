import { supabase } from './supabaseClient';
import { Database } from './supabaseSchema';

// Usamos as interfaces do schema para tipagem local, mas o cliente permanece genérico
type Tables = Database['public']['Tables'];

export const authService = {
  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return data;
  },
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data) return null;
    return data.user;
  },
  async logout() {
    await supabase.auth.signOut();
  }
};

export const dbService = {
  async getObras() {
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar obras:', error.message);
      return [];
    }
    return data || [];
  },

  async createPedido(pedido: any, itens: any[]) {
    try {
      const { data: newPedido, error: pError } = await supabase
        .from('pedidos')
        .insert(pedido)
        .select()
        .single();

      if (pError) throw pError;
      if (!newPedido) throw new Error('Falha ao criar pedido');

      const itensComId = itens.map(item => ({ ...item, order_id: (newPedido as any).id }));
      const { error: iError } = await supabase
        .from('pedido_itens')
        .insert(itensComId);

      if (iError) throw iError;

      return { success: true, pedido: newPedido };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  async getPedidoFull(orderId: string) {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        obras (nome, endereco),
        pedido_itens (
          *,
          materials (nome, unidade)
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateMaterialStock(materialId: string, quantityToSubtract: number) {
    const { data: mat, error: fetchError } = await (supabase
      .from('materials') as any)
      .select('quantidade')
      .eq('id', materialId)
      .single();

    if (fetchError || !mat) throw new Error('Material não encontrado');

    const newQty = (mat as any).quantidade - quantityToSubtract;

    const { data, error } = await (supabase
      .from('materials') as any)
      .update({ quantidade: newQty })
      .eq('id', materialId)
      .select();

    if (error) throw error;
    return data || [];
  }
};

export const lookupService = {
  async getSuppliers() {
    const { data } = await supabase.from('suppliers').select('*').eq('status', 'ativo');
    return data || [];
  },
  async getMaterials() {
    const { data } = await supabase.from('materials').select('*');
    return data || [];
  }
};