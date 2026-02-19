import { supabase } from './supabaseClient';
import { Database } from './supabaseSchema';

type Tables = Database['public']['Tables'];

/**
 * 1. AUTENTICAÇÃO (Frontend - React)
 */
export const authService = {
  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return data;
  },
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },
  async logout() {
    await supabase.auth.signOut();
  }
};

/**
 * 2. OPERAÇÕES DE NEGÓCIO (CRUD)
 */
export const dbService = {
  // BUSCAR TODAS AS OBRAS
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

  // CRIAR NOVO PEDIDO COM ITENS (Transação no Frontend)
  async createPedido(pedido: Tables['pedidos']['Insert'], itens: Tables['pedido_itens']['Insert'][]) {
    try {
      // 1. Inserir o Pedido
      const { data: newPedido, error: pError } = await supabase
        .from('pedidos')
        .insert(pedido)
        .select()
        .single();

      if (pError) throw pError;
      if (!newPedido) throw new Error('Falha ao criar pedido');

      // 2. Inserir os Itens vinculados ao ID do pedido criado
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

  // BUSCAR PEDIDO COM RELAÇÕES (Join)
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

  // BACKEND: Operação Segura (Update de Estoque via supabaseAdmin)
  async updateMaterialStock(materialId: string, quantityToSubtract: number) {
    // Busca a quantidade atual
    const { data: mat } = await (supabase
      .from('materials') as any)
      .select('quantidade')
      .eq('id', materialId)
      .single();

    if (!mat) throw new Error('Material não encontrado');

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

/**
 * 3. EXEMPLO DE BUSCA POR TABELAS ESPECÍFICAS
 */
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