
import React from 'react';
import { Building2, Edit3, Trash2 } from 'lucide-react';
import { Obra } from '../../types';

interface ObraCardProps {
  obra: Obra;
  onClick: (id: string) => void;
}

const ObraCard: React.FC<ObraCardProps> = ({ obra, onClick }) => {
  return (
    <div 
      onClick={() => onClick(obra.id)}
      className="bg-[#1A1A1A] p-6 rounded-lg border border-white/5 hover:border-[#F97316]/40 transition-all duration-300 group cursor-pointer hover:-translate-y-1 shadow-lg hover:shadow-[#F97316]/5"
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-xl text-white group-hover:text-[#F97316] transition-colors line-clamp-1">
          {obra.nome}
        </h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); /* Edit logic */ }}
            className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); /* Delete logic */ }}
            className="p-2 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-8 flex items-center gap-2">
        <Building2 size={14} className="text-[#F97316]/70" /> 
        <span className="line-clamp-1">{obra.endereco}</span>
      </p>

      <div className="pt-4 border-t border-white/5 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Orçamento Planejado</p>
          <p className="text-xl font-black text-[#F97316]">
            <span className="text-xs mr-1 opacity-70 font-bold">R$</span>
            {obra.orcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#F97316] transition-colors">
           <div className="w-1.5 h-1.5 bg-white group-hover:bg-[#F97316] rounded-full transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default ObraCard;
