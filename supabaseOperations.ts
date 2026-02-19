
// Fix: Removed supabaseAdmin from import as it is not exported by supabaseClient.
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
    return data;
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

      // 2. Inserir os Itens vinculados ao ID do pedido criado
      const itensComId = itens.map(item => ({ ...item, order_id: newPedido.id }));
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
  // Exemplo de como buscar pedido, a obra vinculada e os itens do pedido em uma única chamada
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
    // Fix: Replaced supabaseAdmin with supabase as the admin client is not available in the public client context.
    const { data: mat } = await supabase
      .from('materials')
      .select('quantidade')
      .eq('id', materialId)
      .single();

    if (!mat) throw new Error('Material não encontrado');

    const newQty = mat.quantidade - quantityToSubtract;

    // Faz o update bypassando RLS
    // Fix: Replaced supabaseAdmin with supabase as the admin client is not available in the public client context.
    const { data, error } = await supabase
      .from('materials')
      .update({ quantidade: newQty })
      .eq('id', materialId)
      .select();

    if (error) throw error;
    return data;
  }
};

/**
 * 3. EXEMPLO DE BUSCA POR TABELAS ESPECÍFICAS
 */
export const lookupService = {
  async getSuppliers() {
    return await supabase.from('suppliers').select('*').eq('status', 'ativo');
  },
  async getMaterials() {
    return await supabase.from('materials').select('*');
  }
};
