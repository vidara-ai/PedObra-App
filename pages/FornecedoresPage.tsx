
import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Loader2, 
  Truck, 
  Search, 
  Filter, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Briefcase, 
  Shield, 
  Mail, 
  Phone as PhoneIcon, 
  Globe,
  CreditCard,
  Clock,
  ChevronDown
} from 'lucide-react';
import { MOCK_FORNECEDORES, MATERIAL_CATEGORIES, PAYMENT_TERMS, STATES_BR } from '../constants';
import { Supplier } from '../types';
import { useAuth } from '../contexts/AuthContext';

const FornecedoresPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [fornecedores, setFornecedores] = useState<Supplier[]>(MOCK_FORNECEDORES);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fix: removed 'master' check as it is not a valid UserRole
  const isAdmin = user?.role === 'admin';

  // Form State
  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
    companyName: '',
    tradeName: '',
    cnpj: '',
    stateRegistration: '',
    phone: '',
    email: '',
    website: '',
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: 'SP',
    categories: [],
    averageDeliveryDays: 0,
    paymentTerms: 'À vista',
    status: 'ativo'
  });

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
      .substring(0, 15);
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter(c => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setLoading(true);

    // Mock validation
    if (fornecedores.some(f => f.cnpj === formData.cnpj)) {
      alert("Este CNPJ já está cadastrado.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newSupplier: Supplier = {
        ...formData,
        id: `S${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      };

      setFornecedores(prev => [newSupplier, ...prev]);
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setView('list');
      
      // Reset form
      setFormData({
        companyName: '', tradeName: '', cnpj: '', stateRegistration: '',
        phone: '', email: '', website: '', zipCode: '', address: '',
        number: '', complement: '', district: '', city: '', state: 'SP',
        categories: [], averageDeliveryDays: 0, paymentTerms: 'À vista',
        status: 'ativo'
      });
    }, 1200);
  };

  const filteredSuppliers = fornecedores.filter(f => 
    f.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.cnpj.includes(searchTerm)
  );

  const renderList = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-white uppercase">FORNECEDORES</h3>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Gestão de fornecedores e parceiros</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setView('create')}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#F97316] text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-orange-500/10 hover:bg-[#fb923c] transition-all active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Novo Fornecedor
          </button>
        )}
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome ou CNPJ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-[#0B0B0B] border border-white/5 rounded-xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-all placeholder:text-gray-600"
            />
          </div>
          <button className="px-5 h-12 bg-[#0B0B0B] border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Filter size={16} className="text-[#F97316]" /> Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0B0B0B] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Empresa</th>
                <th className="px-8 py-5">CNPJ</th>
                <th className="px-8 py-5">Contato</th>
                <th className="px-8 py-5">Cidade</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredSuppliers.map(sup => (
                <tr key={sup.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-white group-hover:text-[#F97316] transition-colors">{sup.companyName}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{sup.tradeName}</p>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-gray-400">
                    {sup.cnpj}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-white text-xs flex items-center gap-2"><PhoneIcon size={12} className="text-[#F97316]" /> {sup.phone}</p>
                    <p className="text-gray-500 text-[10px] font-medium mt-1 lowercase truncate max-w-[150px]">{sup.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-white text-xs">{sup.city}</p>
                    <p className="text-gray-500 text-[10px] font-bold uppercase">{sup.state}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                      sup.status === 'ativo' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    }`}>
                      {sup.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Visualizar</button>
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
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => setView('list')}
          className="p-3 bg-[#1A1A1A] text-gray-400 hover:text-white rounded-full border border-white/5 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">CADASTRAR NOVO FORNECEDOR</h3>
          <p className="text-xs font-bold text-[#F97316] tracking-widest uppercase mt-1">Expansão da rede de parceiros</p>
        </div>
      </div>

      <form onSubmit={handleSaveSupplier} className="space-y-6">
        {/* SEÇÃO 1 – DADOS DA EMPRESA */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#F97316]"></div>
             <Building2 size={18} className="text-[#F97316]" /> Dados da Empresa
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Razão Social</label>
              <input 
                type="text" required
                value={formData.companyName}
                onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Ex: Forte Mix Cimentos S.A."
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Nome Fantasia</label>
              <input 
                type="text"
                value={formData.tradeName}
                onChange={e => setFormData(prev => ({ ...prev, tradeName: e.target.value }))}
                placeholder="Ex: Forte Mix"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">CNPJ</label>
              <input 
                type="text" required
                value={formData.cnpj}
                onChange={e => setFormData(prev => ({ ...prev, cnpj: maskCNPJ(e.target.value) }))}
                placeholder="00.000.000/0000-00"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Inscrição Estadual</label>
              <input 
                type="text"
                value={formData.stateRegistration}
                onChange={e => setFormData(prev => ({ ...prev, stateRegistration: e.target.value }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Telefone</label>
              <input 
                type="text" required
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: maskPhone(e.target.value) }))}
                placeholder="(00) 00000-0000"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="vendas@empresa.com"
                  className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl pl-12 pr-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Site</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="www.empresa.com.br"
                  className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl pl-12 pr-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2 – ENDEREÇO */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#F97316]"></div>
             <MapPin size={18} className="text-[#F97316]" /> Endereço
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">CEP</label>
              <input 
                type="text" required
                value={formData.zipCode}
                onChange={e => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                placeholder="00000-000"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Logradouro (Rua/Av)</label>
              <input 
                type="text" required
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Número</label>
              <input 
                type="text" required
                value={formData.number}
                onChange={e => setFormData(prev => ({ ...prev, number: e.target.value }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Complemento</label>
              <input 
                type="text"
                value={formData.complement}
                onChange={e => setFormData(prev => ({ ...prev, complement: e.target.value }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Bairro</label>
              <input 
                type="text" required
                value={formData.district}
                onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cidade</label>
              <input 
                type="text" required
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Estado</label>
              <div className="relative">
                <select 
                  value={formData.state}
                  onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] appearance-none"
                >
                  {STATES_BR.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3 – INFORMAÇÕES COMERCIAIS */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#F97316]"></div>
             <Briefcase size={18} className="text-[#F97316]" /> Informações Comerciais
          </h4>
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Categoria de Fornecimento (Múltipla Seleção)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[...MATERIAL_CATEGORIES, 'Equipamentos', 'Serviços'].map(cat => (
                  <button 
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-4 py-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
                      formData.categories.includes(cat) 
                        ? 'bg-[#F97316] border-[#F97316] text-white shadow-lg shadow-orange-500/10' 
                        : 'bg-[#0B0B0B] border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Prazo Médio de Entrega (Dias)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input 
                    type="number" required
                    value={formData.averageDeliveryDays}
                    onChange={e => setFormData(prev => ({ ...prev, averageDeliveryDays: parseInt(e.target.value) || 0 }))}
                    className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl pl-12 px-5 text-white focus:outline-none focus:border-[#F97316] transition-all font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Condição de Pagamento</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <select 
                    value={formData.paymentTerms}
                    onChange={e => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl pl-12 px-5 text-white focus:outline-none focus:border-[#F97316] appearance-none"
                  >
                    {PAYMENT_TERMS.map(term => <option key={term} value={term}>{term}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 4 – STATUS */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#F97316]"></div>
              <label className="text-sm font-black text-white uppercase tracking-[0.2em]">Status do Fornecedor</label>
            </div>
            <div className="flex items-center gap-4 px-5 py-3 bg-[#0B0B0B] border border-white/10 rounded-xl">
               <span className={`text-[10px] font-black uppercase tracking-widest ${formData.status === 'ativo' ? 'text-[#F97316]' : 'text-gray-500'}`}>
                 {formData.status === 'ativo' ? 'Ativo' : 'Inativo'}
               </span>
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
            disabled={loading}
            className="flex-[2] h-16 bg-[#F97316] text-white font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#fb923c] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none group"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} className="group-hover:scale-125 transition-transform" />}
            {loading ? 'Salvando...' : 'Salvar Fornecedor'}
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
              <p className="text-white font-black text-sm uppercase tracking-wider">Cadastro Finalizado</p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-0.5">Novo fornecedor ativo no sistema.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FornecedoresPage;
