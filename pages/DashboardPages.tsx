
import React, { useState } from 'react';
import { MOCK_EMPRESAS, MOCK_PEDIDOS, MOCK_OBRAS, MOCK_MATERIAIS } from '../constants';
import { Plus, Download, Filter, Trash2, Edit3, Check, X, FileText, Building2, Package } from 'lucide-react';
import ObraCard from '../components/obra/ObraCard';
import NovaObraModal from '../components/obra/NovaObraModal';
import { Obra } from '../types';

// Master Page
export const MasterDash: React.FC = () => (
  <div className="space-y-8 animate-fade-in-up">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Total Empresas', val: MOCK_EMPRESAS.length, color: 'text-white' },
        { label: 'Ativas', val: MOCK_EMPRESAS.filter(e => e.status === 'ativa').length, color: 'text-green-500' },
        { label: 'Inativas', val: MOCK_EMPRESAS.filter(e => e.status === 'inativa').length, color: 'text-red-500' },
        { label: 'Total Pedidos', val: '245', color: 'text-[#F97316]' },
      ].map((card, i) => (
        <div key={i} className="bg-[#1A1A1A] p-6 rounded-lg border border-white/5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.label}</p>
          <p className={`text-4xl font-black mt-2 ${card.color}`}>{card.val}</p>
        </div>
      ))}
    </div>
    <div className="bg-[#1A1A1A] rounded-lg border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-lg text-white">Empresas Cadastradas</h3>
        <button className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-[#fb923c] transition-colors">
          <Plus size={16} /> Nova Empresa
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-[#0B0B0B] text-xs font-bold text-gray-400 uppercase tracking-widest">
          <tr>
            <th className="px-6 py-4">Empresa</th>
            <th className="px-6 py-4">Cadastro</th>
            <th className="px-6 py-4">Pedidos</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
          {MOCK_EMPRESAS.map(emp => (
            <tr key={emp.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-bold text-white">{emp.nome}</td>
              <td className="px-6 py-4 text-gray-400">{emp.dataCadastro}</td>
              <td className="px-6 py-4 font-mono text-white">{emp.totalPedidos}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${emp.status === 'ativa' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {emp.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-[#F97316] hover:underline font-bold text-xs uppercase tracking-widest transition-colors">Alternar Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Admin View: Obras
export const ObrasPage: React.FC = () => {
  const [obras, setObras] = useState<Obra[]>(MOCK_OBRAS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSaveObra = (newObraData: { nome: string; responsavel: string; endereco: string; orcamento: number }) => {
    const newObra: Obra = {
      id: Math.random().toString(36).substr(2, 9),
      nome: newObraData.nome,
      endereco: newObraData.endereco,
      orcamento: newObraData.orcamento
    };
    setObras(prev => [newObra, ...prev]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleObraClick = (id: string) => {
    console.log(`Navigating to /admin/obras/${id}`);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-white uppercase">Gestão de Obras</h3>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Total: {obras.length} canteiros</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#F97316] text-white px-6 py-4 rounded-lg font-bold uppercase tracking-widest shadow-xl shadow-orange-500/10 hover:bg-[#fb923c] transition-all active:scale-95"
        >
          <Plus size={20} /> Cadastrar Obra
        </button>
      </div>

      {obras.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#1A1A1A] rounded-2xl border border-dashed border-white/10">
          <div className="bg-[#F97316]/10 p-6 rounded-full mb-6">
            <Building2 size={48} className="text-[#F97316]" />
          </div>
          <p className="text-xl font-bold text-white mb-2">Nenhuma obra cadastrada ainda.</p>
          <p className="text-gray-500 mb-8 max-w-xs text-center text-sm">Comece a organizar seus pedidos criando seu primeiro canteiro de obra.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-[#F97316] font-black uppercase tracking-widest text-sm hover:underline"
          >
            Cadastrar primeira obra
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obras.map(obra => (
            <ObraCard key={obra.id} obra={obra} onClick={handleObraClick} />
          ))}
        </div>
      )}

      <NovaObraModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveObra} 
      />

      {showToast && (
        <div className="fixed bottom-8 right-8 z-[110] bg-[#1A1A1A] border-l-4 border-[#F97316] p-4 rounded-r shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-[#F97316] rounded-full p-1">
              <Check size={14} className="text-white" />
            </div>
            <p className="text-white font-bold text-sm uppercase tracking-wider">Obra cadastrada com sucesso.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// User View: Create/View Orders
export const UserDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black tracking-tighter text-white uppercase">Minha Obra</h3>
          <p className="text-[#F97316] text-sm font-bold uppercase tracking-widest">Residencial Aurora</p>
        </div>
        <div className="bg-orange-500/5 px-4 py-2 rounded-lg border border-orange-500/10 hidden md:block">
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gestão de Insumos</p>
           <p className="text-white font-black text-sm">Painel do Solicitante</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h4 className="font-bold text-lg uppercase tracking-widest text-gray-400">Meus Pedidos Recentes</h4>
          <div className="space-y-4">
            {MOCK_PEDIDOS.map((ped) => (
              <div key={ped.id} className="bg-[#1A1A1A] p-5 rounded-lg border border-white/5 flex items-center justify-between group hover:border-[#F97316]/20 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#F97316] font-mono font-bold text-sm">#{ped.id}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ped.status === 'APROVADO' ? 'bg-green-500/20 text-green-500' : 
                      ped.status === 'PENDENTE' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {ped.status}
                    </span>
                  </div>
                  <p className="text-white font-bold group-hover:text-[#F97316] transition-colors">{ped.itens.length} itens no pedido</p>
                  <p className="text-gray-500 text-xs mt-1">{ped.data}</p>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <FileText size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-lg uppercase tracking-widest text-gray-400">Catálogo Rápido</h4>
          <div className="bg-[#1A1A1A] rounded-lg border border-white/5 divide-y divide-white/5">
            {MOCK_MATERIAIS.map((mat) => (
              <div key={mat.id} className="p-4 flex items-center justify-between group">
                <div>
                  <p className="text-white font-bold text-sm">{mat.nome}</p>
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-tighter">{mat.unidade}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#F97316] font-mono font-bold text-xs">R$ {mat.valorUnitario.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
