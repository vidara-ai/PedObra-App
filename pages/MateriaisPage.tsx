
import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Loader2, 
  Package, 
  Search, 
  ArrowLeft, 
  AlertTriangle, 
  Tag, 
  MapPin, 
  DollarSign, 
  Truck,
  Layers,
  Archive
} from 'lucide-react';
import { MOCK_MATERIAIS, MATERIAL_CATEGORIES, MATERIAL_UNITS } from '../constants';
import { Material } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MateriaisPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [materiais, setMateriais] = useState<Material[]>(MOCK_MATERIAIS);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fix: removed 'master' check as it is not a valid UserRole
  const isAdmin = user?.role === 'admin';

  // Form State
  const [formData, setFormData] = useState<Omit<Material, 'id'>>({
    nome: '',
    codigoInterno: '',
    categoria: 'Cimento',
    unidade: 'UN',
    quantidadeAtual: 0,
    estoqueMinimo: 0,
    localizacao: '',
    valorUnitario: 0,
    status: 'ativo'
  });

  const filteredMaterials = materiais.filter(m => 
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.codigoInterno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setLoading(true);

    setTimeout(() => {
      const newMaterial: Material = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };

      setMateriais(prev => [newMaterial, ...prev]);
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setView('list');
      
      // Reset form
      setFormData({
        nome: '', codigoInterno: '', categoria: 'Cimento', unidade: 'UN',
        quantidadeAtual: 0, estoqueMinimo: 0, localizacao: '', valorUnitario: 0,
        status: 'ativo'
      });
    }, 1200);
  };

  const renderList = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-white uppercase">MATERIAIS</h3>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Gerenciamento de insumos da obra</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setView('create')}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#F97316] text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-orange-500/10 hover:bg-[#fb923c] transition-all active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Novo Material
          </button>
        )}
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F97316] transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Buscar por nome ou código interno..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full h-14 bg-[#1A1A1A] border border-white/5 rounded-2xl pl-12 pr-6 text-white focus:outline-none focus:border-[#F97316]/50 transition-all placeholder:text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map(mat => {
          const isLowStock = mat.quantidadeAtual <= mat.estoqueMinimo;
          return (
            <div key={mat.id} className={`bg-[#1A1A1A] rounded-2xl border border-white/5 p-6 transition-all hover:bg-[#222] hover:border-[#F97316]/20 group relative overflow-hidden`}>
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-opacity group-hover:opacity-10 ${isLowStock ? 'bg-red-500' : 'bg-[#F97316]'}`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isLowStock ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-white/5 border-white/5 text-[#F97316]'}`}>
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-[#F97316] transition-colors">{mat.nome}</h4>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{mat.codigoInterno}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${isLowStock ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                  {isLowStock ? 'Estoque Baixo' : 'Estoque OK'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-tighter flex items-center gap-1.5"><Layers size={14} /> Categoria</span>
                  <span className="text-white font-medium">{mat.categoria}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-tighter flex items-center gap-1.5"><MapPin size={14} /> Localização</span>
                  <span className="text-white font-medium truncate max-w-[150px]">{mat.localizacao}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-tighter flex items-center gap-1.5"><DollarSign size={14} /> Custo Unit.</span>
                  <span className="text-[#F97316] font-bold">R$ {mat.valorUnitario.toFixed(2)} / {mat.unidade}</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-1 ${isLowStock ? 'bg-red-500/5' : 'bg-[#0B0B0B]'}`}>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quantidade Disponível</p>
                 <p className={`text-2xl font-black ${isLowStock ? 'text-red-500' : 'text-white'}`}>
                    {mat.quantidadeAtual} <span className="text-xs font-bold text-gray-600 ml-1">{mat.unidade}</span>
                 </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => setView('list')}
          className="p-3 bg-[#1A1A1A] text-gray-400 hover:text-white rounded-full border border-white/5 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">CADASTRAR NOVO MATERIAL</h3>
          <p className="text-xs font-bold text-[#F97316] tracking-widest uppercase mt-1">Inclusão de insumo no catálogo</p>
        </div>
      </div>

      <form onSubmit={handleSaveMaterial} className="space-y-6">
        {/* Seção 1 – Informações Básicas */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#F97316]"></div>
             <Tag size={18} className="text-[#F97316]" /> Informações Básicas
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Nome do Material</label>
              <input 
                type="text" 
                required
                value={formData.nome}
                onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Cimento CP-II"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Código Interno</label>
              <input 
                type="text" 
                value={formData.codigoInterno}
                onChange={e => setFormData(prev => ({ ...prev, codigoInterno: e.target.value }))}
                placeholder="Ex: CIM-001"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Categoria</label>
              <select 
                required
                value={formData.categoria}
                onChange={e => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] appearance-none cursor-pointer"
              >
                {MATERIAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Unidade de Medida</label>
              <select 
                required
                value={formData.unidade}
                onChange={e => setFormData(prev => ({ ...prev, unidade: e.target.value }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] appearance-none cursor-pointer"
              >
                {MATERIAL_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Seção 2 – Controle de Estoque */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#F97316]"></div>
             <Archive size={18} className="text-[#F97316]" /> Controle de Estoque
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Quantidade Atual</label>
              <input 
                type="number" 
                value={formData.quantidadeAtual}
                onChange={e => setFormData(prev => ({ ...prev, quantidadeAtual: parseFloat(e.target.value) || 0 }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Estoque Mínimo</label>
              <input 
                type="number" 
                value={formData.estoqueMinimo}
                onChange={e => setFormData(prev => ({ ...prev, estoqueMinimo: parseFloat(e.target.value) || 0 }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Localização no Estoque</label>
              <input 
                type="text" 
                value={formData.localizacao}
                onChange={e => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                placeholder="Ex: Corredor B"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Seção 3 – Valores */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#F97316]"></div>
             <DollarSign size={18} className="text-[#F97316]" /> Valores e Status
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Custo Unitário (R$)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.valorUnitario}
                  onChange={e => setFormData(prev => ({ ...prev, valorUnitario: parseFloat(e.target.value) || 0 }))}
                  className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl pl-12 pr-5 text-white focus:outline-none focus:border-[#F97316] transition-all font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</label>
              <div className="flex items-center h-14 px-5 bg-[#0B0B0B] border border-white/10 rounded-xl">
                 <span className="flex-1 text-sm font-bold text-gray-400">{formData.status === 'ativo' ? 'Ativo' : 'Inativo'}</span>
                 <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'ativo' ? 'inativo' : 'ativo' }))}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.status === 'ativo' ? 'bg-[#F97316]' : 'bg-gray-700'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.status === 'ativo' ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerta de Estoque Baixo em tempo real */}
        {formData.quantidadeAtual <= formData.estoqueMinimo && formData.estoqueMinimo > 0 && (
           <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-pulse">
              <AlertTriangle className="text-red-500" size={24} />
              <div>
                <p className="text-red-500 font-black text-xs uppercase tracking-widest">Alerta de Estoque Crítico</p>
                <p className="text-red-500/70 text-[10px] font-bold uppercase mt-0.5">A quantidade atual está abaixo ou igual ao mínimo definido.</p>
              </div>
           </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-12">
          <button 
            type="button"
            onClick={() => setView('list')}
            className="flex-1 h-16 border border-white/10 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-[2] h-16 bg-[#F97316] text-white font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#fb923c] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none group"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} className="group-hover:scale-125 transition-transform" />}
            {loading ? 'Salvando...' : 'Salvar Material'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="relative">
      {view === 'list' ? renderList() : renderCreate()}

      {showToast && (
        <div className="fixed bottom-8 right-8 z-[110] bg-[#1A1A1A] border-l-4 border-[#F97316] p-5 rounded-r-xl shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-[#F97316] rounded-full p-1.5 flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-wider">Cadastro Concluído</p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-0.5">Material adicionado ao catálogo.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MateriaisPage;
