
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Check, 
  X, 
  Download, 
  Filter, 
  FileText, 
  ArrowLeft, 
  Trash2, 
  ShoppingCart, 
  Calendar, 
  User as UserIcon, 
  Building2, 
  AlertCircle,
  Package,
  ChevronDown,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { MOCK_PEDIDOS, MOCK_OBRAS, MOCK_MATERIAIS } from '../constants';
import { Pedido, PedidoPriority, Material } from '../types';
import { useAuth } from '../contexts/AuthContext';

const PedidosPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [pedidos, setPedidos] = useState<Pedido[]>(MOCK_PEDIDOS);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Fix: removed 'master' check as it is not a valid UserRole
  const isAdmin = user?.role === 'admin';

  // Find the obra linked to the user if they are a standard 'user'
  const userObra = useMemo(() => {
    return MOCK_OBRAS.find(o => o.id === user?.obraId);
  }, [user]);

  // Logic to generate unique order code: DDMM_HHMMSS + 2 random digits
  const generateOrderCode = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const rand = String(Math.floor(Math.random() * 90) + 10);
    return `${dd}${mm}_${hh}${min}${ss}${rand}`;
  };

  // Form State
  const [formData, setFormData] = useState({
    // Fix: changed 'usuario' to 'user' to match UserRole
    obraId: user?.role === 'user' ? user?.obraId || '' : '',
    prioridade: 'BAIXA' as PedidoPriority,
    observacoes: '',
    itens: [] as { 
      materialId: string; 
      nome: string; 
      quantidade: number; 
      unidade: string; 
      valorUnitario: number; 
      total: number; 
      estoque: number;
      observacao?: string;
    }[]
  });

  const subtotal = useMemo(() => {
    return formData.itens.reduce((acc, item) => acc + item.total, 0);
  }, [formData.itens]);

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, { materialId: '', nome: '', quantidade: 1, unidade: '-', valorUnitario: 0, total: 0, estoque: 0, observacao: '' }]
    }));
  };

  const handleUpdateItem = (index: number, materialId: string) => {
    const mat = MOCK_MATERIAIS.find(m => m.id === materialId);
    if (!mat) return;

    const newItens = [...formData.itens];
    newItens[index] = {
      ...newItens[index],
      materialId: mat.id,
      nome: mat.nome,
      unidade: mat.unidade,
      valorUnitario: mat.valorUnitario,
      total: newItens[index].quantidade * mat.valorUnitario,
      estoque: mat.quantidadeAtual
    };
    setFormData(prev => ({ ...prev, itens: newItens }));
  };

  const handleUpdateQty = (index: number, qty: number) => {
    const newItens = [...formData.itens];
    newItens[index].quantidade = qty;
    newItens[index].total = qty * newItens[index].valorUnitario;
    setFormData(prev => ({ ...prev, itens: newItens }));
  };

  const handleUpdateItemObs = (index: number, obs: string) => {
    const newItens = [...formData.itens];
    newItens[index].observacao = obs;
    setFormData(prev => ({ ...prev, itens: newItens }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index)
    }));
  };

  const handleSavePedido = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.itens.length === 0 || !formData.obraId) {
      alert("Selecione uma obra e pelo menos um item.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const selectedObra = MOCK_OBRAS.find(o => o.id === formData.obraId);
      const newPedido: Pedido = {
        id: Math.random().toString(36).substr(2, 9),
        orderCode: generateOrderCode(),
        obraId: formData.obraId,
        obraNome: selectedObra?.nome || 'Obra Desconhecida',
        solicitante: user?.name || 'Sistema',
        data: new Date().toISOString().split('T')[0],
        prioridade: formData.prioridade,
        status: 'PENDENTE',
        subtotal: subtotal,
        itens: formData.itens,
        observacoes: formData.observacoes
      };

      setPedidos(prev => [newPedido, ...prev]);
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setView('list');
      // Reset
      setFormData({ 
        // Fix: changed 'usuario' to 'user' to match UserRole
        obraId: user?.role === 'user' ? user?.obraId || '' : '', 
        prioridade: 'BAIXA', 
        observacoes: '', 
        itens: [] 
      });
    }, 1500);
  };

  const renderList = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-white uppercase">
            {/* Fix: changed 'usuario' to 'user' to match UserRole */}
            {user?.role === 'user' ? 'MEUS PEDIDOS' : 'PEDIDOS'}
          </h3>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">
            {/* Fix: changed 'usuario' to 'user' to match UserRole */}
            {user?.role === 'user' ? 'Acompanhe suas solicitações' : 'Gerenciamento de solicitações de materiais'}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setView('create')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F97316] text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-orange-500/10 hover:bg-[#fb923c] transition-all active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
            Novo Pedido
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#0B0B0B] border border-white/5 rounded-lg text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                 <Filter size={14} className="text-[#F97316]" /> Filtros
              </button>
           </div>
           {isAdmin && (
             <button className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-colors">
                <Download size={14} /> Exportar CSV
             </button>
           )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0B0B0B] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Identificação</th>
                <th className="px-8 py-5">Obra / Solicitante</th>
                <th className="px-8 py-5">Prioridade</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {pedidos
                .filter(p => isAdmin ? true : p.solicitante === user?.name)
                .map(ped => (
                <tr key={ped.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-mono text-[#F97316] font-bold">#{ped.orderCode}</p>
                    <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5">
                       <Calendar size={12} /> {ped.data}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-white group-hover:text-[#F97316] transition-colors">{ped.obraNome}</p>
                    <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5">
                       <UserIcon size={12} /> {ped.solicitante}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                      ped.prioridade === 'ALTA' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                      ped.prioridade === 'MÉDIA' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' :
                      'text-blue-500 border-blue-500/20 bg-blue-500/5'
                    }`}>
                      {ped.prioridade}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      ped.status === 'APROVADO' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      ped.status === 'PENDENTE' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {ped.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    {isAdmin && ped.status === 'PENDENTE' ? (
                      <div className="flex justify-end gap-2">
                        <button title="Aprovar" className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all">
                           <Check size={18} />
                        </button>
                        <button title="Rejeitar" className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                           <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button className="p-2 bg-white/5 text-gray-400 rounded-lg hover:text-white transition-all">
                        <FileText size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="max-w-5xl mx-auto animate-fade-in-up pb-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('list')}
            className="p-3 bg-[#1A1A1A] text-gray-400 hover:text-white rounded-full border border-white/5 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
              {/* Fix: changed 'usuario' to 'user' to match UserRole */}
              {user?.role === 'user' ? 'NOVO PEDIDO' : 'CRIAR NOVO PEDIDO'}
            </h3>
            <p className="text-xs font-bold text-[#F97316] tracking-widest uppercase mt-1">
              {/* Fix: changed 'usuario' to 'user' to match UserRole */}
              {user?.role === 'user' ? 'Solicitação de materiais para a obra' : 'Solicitação formal de insumos'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setView('list')}
          className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
        >
          {/* Fix: changed 'usuario' to 'user' to match UserRole */}
          {user?.role === 'user' ? '← Voltar para Meus Pedidos' : 'Voltar para lista'}
        </button>
      </div>

      <form onSubmit={handleSavePedido} className="space-y-6">
        {/* SEÇÃO 1 – INFORMAÇÕES GERAIS */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#F97316]"></div>
             <Building2 size={18} className="text-[#F97316]" /> Informações Gerais
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Obra</label>
              {/* Fix: changed 'usuario' to 'user' to match UserRole */}
              {user?.role === 'user' ? (
                <div className="w-full h-14 bg-[#0B0B0B]/50 border border-white/5 rounded-xl px-5 flex items-center text-gray-400 font-bold">
                  {userObra?.nome || 'Obra Vinculada'}
                </div>
              ) : (
                <div className="relative">
                  <select 
                    required
                    value={formData.obraId}
                    onChange={e => setFormData(prev => ({ ...prev, obraId: e.target.value }))}
                    className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecione a obra</option>
                    {MOCK_OBRAS.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Solicitante</label>
              <div className="w-full h-14 bg-[#0B0B0B]/50 border border-white/5 rounded-xl px-5 flex items-center text-gray-400 font-bold">
                 {user?.name || 'Sistema'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Prioridade</label>
              <div className="relative">
                <select 
                  value={formData.prioridade}
                  onChange={e => setFormData(prev => ({ ...prev, prioridade: e.target.value as PedidoPriority }))}
                  className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] appearance-none cursor-pointer"
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MÉDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2 – ADICIONAR MATERIAIS */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#F97316]"></div>
              {/* Fix: changed 'usuario' to 'user' to match UserRole */}
              <ShoppingCart size={18} className="text-[#F97316]" /> {user?.role === 'user' ? 'Solicitar Materiais' : 'Itens do Pedido'}
            </h4>
            <button 
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 text-[10px] font-black text-[#F97316] uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              <Plus size={16} /> Adicionar Material
            </button>
          </div>

          <div className="overflow-x-auto -mx-8">
            <table className="w-full text-left">
              <thead className="bg-[#0B0B0B] text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-4">Material</th>
                  <th className="px-8 py-4">Unidade</th>
                  <th className="px-8 py-4">Quantidade</th>
                  {isAdmin && (
                    <>
                      <th className="px-8 py-4">Custo Unit.</th>
                      <th className="px-8 py-4">Total</th>
                    </>
                  )}
                  {/* Fix: changed 'usuario' to 'user' to match UserRole */}
                  {user?.role === 'user' && (
                    <th className="px-8 py-4">Observação</th>
                  )}
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {formData.itens.map((item, index) => {
                  const isLowStock = isAdmin && item.materialId && item.quantidade > item.estoque;
                  return (
                    <tr key={index} className="group hover:bg-white/[0.02]">
                      <td className="px-8 py-4 min-w-[200px]">
                        <div className="relative">
                          <select 
                            required
                            value={item.materialId}
                            onChange={e => handleUpdateItem(index, e.target.value)}
                            className="w-full h-12 bg-[#0B0B0B] border border-white/5 rounded-lg px-4 text-white focus:outline-none focus:border-[#F97316] appearance-none cursor-pointer text-sm font-bold"
                          >
                            <option value="" disabled>Buscar material...</option>
                            {MOCK_MATERIAIS.map(m => (
                              <option key={m.id} value={m.id}>{m.nome} ({m.codigoInterno})</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" size={14} />
                        </div>
                        {isLowStock && (
                          <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                            <AlertCircle size={10} /> Estoque Insuficiente ({item.estoque} disp.)
                          </p>
                        )}
                      </td>
                      <td className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {item.unidade}
                      </td>
                      <td className="px-8 py-4">
                        <input 
                          type="number" 
                          min="1"
                          required
                          value={item.quantidade}
                          onChange={e => handleUpdateQty(index, parseFloat(e.target.value) || 0)}
                          className={`w-24 h-12 bg-[#0B0B0B] border ${isLowStock ? 'border-red-500/50' : 'border-white/5'} rounded-lg px-4 text-white focus:outline-none focus:border-[#F97316] font-mono`}
                        />
                      </td>
                      {isAdmin && (
                        <>
                          <td className="px-8 py-4 text-xs font-mono text-gray-400">
                            R$ {item.valorUnitario.toFixed(2)}
                          </td>
                          <td className="px-8 py-4 text-xs font-mono font-bold text-[#F97316]">
                            R$ {item.total.toFixed(2)}
                          </td>
                        </>
                      )}
                      {/* Fix: changed 'usuario' to 'user' to match UserRole */}
                      {user?.role === 'user' && (
                        <td className="px-8 py-4 min-w-[200px]">
                          <input 
                            type="text" 
                            placeholder="Obs. específica"
                            value={item.observacao}
                            onChange={e => handleUpdateItemObs(index, e.target.value)}
                            className="w-full h-12 bg-[#0B0B0B] border border-white/5 rounded-lg px-4 text-white focus:outline-none focus:border-[#F97316] text-xs"
                          />
                        </td>
                      )}
                      <td className="px-8 py-4 text-right">
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {formData.itens.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/5 rounded-xl mt-4">
               <Package size={40} className="mb-4 opacity-20" />
               <p className="text-xs font-black uppercase tracking-widest">Nenhum item adicionado</p>
               <button 
                type="button"
                onClick={handleAddItem}
                className="mt-4 text-[#F97316] hover:underline text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Clique aqui para começar
              </button>
            </div>
          )}

          <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-white/5 pt-8">
             <div className="flex-1 w-full md:max-w-md">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Observações Gerais</label>
                <textarea 
                  value={formData.observacoes}
                  onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Instruções adicionais ou detalhes para o almoxarifado..."
                  className="w-full h-24 bg-[#0B0B0B] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#F97316] transition-all text-sm resize-none"
                />
             </div>
             {isAdmin && (
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Subtotal do Pedido</p>
                  <p className="text-4xl font-black text-white tracking-tighter">
                     <span className="text-sm font-bold text-[#F97316] mr-2">R$</span>
                     {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
               </div>
             )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            type="button"
            onClick={() => setView('list')}
            className="flex-1 h-16 border border-white/10 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all text-sm"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading || formData.itens.length === 0}
            className="flex-[2] h-16 bg-[#F97316] text-white font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#fb923c] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:pointer-events-none group"
          >
            {/* Fix: changed 'usuario' to 'user' to match UserRole */}
            {loading ? <Loader2 size={24} className="animate-spin" /> : <ShoppingCart size={24} className="group-hover:translate-x-1 transition-transform" />}
            {loading ? 'Processando...' : user?.role === 'user' ? 'Enviar Solicitação' : 'Enviar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="relative">
      {view === 'list' ? renderList() : renderCreate()}

      {showToast && (
        <div className="fixed bottom-8 right-8 z-[110] bg-[#1A1A1A] border-l-4 border-green-500 p-5 rounded-r-xl shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 rounded-full p-1.5 flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-wider">
                {/* Fix: changed 'usuario' to 'user' to match UserRole */}
                {user?.role === 'user' ? 'Pedido enviado para aprovação' : 'Pedido Enviado'}
              </p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-0.5">
                {/* Fix: changed 'usuario' to 'user' to match UserRole */}
                {user?.role === 'user' ? 'Seu pedido será analisado pelo gestor.' : 'Aguardando aprovação do gestor.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosPage;
