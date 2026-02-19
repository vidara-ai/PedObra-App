import React, { useState, useEffect } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface NovaObraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (obra: { nome: string; responsavel: string; endereco: string; orcamento: number }) => void;
}

const NovaObraModal: React.FC<NovaObraModalProps> = ({ isOpen, onClose, onSave }) => {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [endereco, setEndereco] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Buscar usuários com role 'user' do Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome')
        .eq('role', 'user')
        .order('nome');

      if (!error && data) {
        setUsers(data);
      }
    };

    if (isOpen) {
      fetchUsers();
      setNome('');
      setResponsavel('');
      setEndereco('');
      setOrcamento('');
      setErrors({});
      // Small delay to ensure focus works after modal animation
      setTimeout(() => {
        const firstInput = document.getElementById('nome-obra');
        firstInput?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!nome) newErrors.nome = 'Nome é obrigatório';
    if (!responsavel) newErrors.responsavel = 'Responsável é obrigatório';
    if (!endereco) newErrors.endereco = 'Endereço é obrigatório';
    if (!orcamento) newErrors.orcamento = 'Orçamento é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      onSave({
        nome,
        responsavel,
        endereco,
        orcamento: parseFloat(orcamento.replace(/[^0-9.-]+/g, "")) || 0
      });
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6">
      {/* Overlay click to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-[520px] max-h-[95vh] bg-[#111] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header - Fixed */}
        <div className="p-6 md:px-8 md:py-6 flex justify-between items-center border-b border-white/5 bg-[#111]">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase">Cadastrar Obra</h3>
            <p className="text-[10px] font-bold text-[#F97316] tracking-widest uppercase mt-0.5">Novo Canteiro de Obra</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 custom-scrollbar">
          {/* Nome da Obra */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Nome da Obra</label>
            <input 
              id="nome-obra"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Residencial Aurora"
              className={`w-full h-12 bg-[#1A1A1A] border ${errors.nome ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 text-white focus:outline-none focus:border-[#F97316] transition-all`}
            />
            {errors.nome && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.nome}</p>}
          </div>

          {/* Responsável pela Obra */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Responsável pela Obra</label>
            <div className="relative">
              <select
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className={`w-full h-12 bg-[#1A1A1A] border ${errors.responsavel ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 text-white focus:outline-none focus:border-[#F97316] appearance-none transition-all pr-10`}
              >
                <option value="" disabled>Selecione um responsável</option>
                {users.length > 0 ? (
                  users.map((user) => (
                    <option key={user.id} value={user.nome}>
                      {user.nome}
                    </option>
                  ))
                ) : (
                  <option disabled>Nenhum usuário padrão disponível.</option>
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={18} />
              </div>
            </div>
            {errors.responsavel && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.responsavel}</p>}
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Endereço Completo</label>
            <input 
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, cidade"
              className={`w-full h-12 bg-[#1A1A1A] border ${errors.endereco ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 text-white focus:outline-none focus:border-[#F97316] transition-all`}
            />
            {errors.endereco && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.endereco}</p>}
          </div>

          {/* Orçamento */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Valor do Orçamento</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">R$</span>
              <input 
                type="number"
                step="0.01"
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
                placeholder="0,00"
                className={`w-full h-12 bg-[#1A1A1A] border ${errors.orcamento ? 'border-red-500' : 'border-white/10'} rounded-lg pl-12 pr-4 text-white focus:outline-none focus:border-[#F97316] transition-all font-mono`}
              />
            </div>
            {errors.orcamento && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.orcamento}</p>}
          </div>
        </form>

        {/* Footer - Fixed */}
        <div className="p-6 md:px-8 md:py-6 border-t border-white/5 bg-[#111]">
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 h-12 border border-white/10 hover:bg-white/5 text-white font-bold uppercase tracking-widest rounded-lg transition-all text-xs"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:flex-1 h-12 bg-[#F97316] hover:bg-[#fb923c] text-white font-bold uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Obra'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.5);
        }
      `}</style>
    </div>
  );
};

export default NovaObraModal;