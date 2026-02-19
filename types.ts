
import { LucideIcon } from 'lucide-react';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  obraId?: string;
  status?: 'ativo' | 'inativo';
  permissions?: {
    aprovarPedidos: boolean;
    editarMateriais: boolean;
    visualizarFinanceiro: boolean;
  };
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Obra {
  id: string;
  nome: string;
  endereco: string;
  orcamento: number;
}

export interface Material {
  id: string;
  nome: string;
  codigoInterno: string;
  categoria: string;
  unidade: string;
  quantidadeAtual: number;
  estoqueMinimo: number;
  localizacao: string;
  valorUnitario: number;
  fornecedorId?: string;
  status: 'ativo' | 'inativo';
}

export type PedidoPriority = 'BAIXA' | 'MÉDIA' | 'ALTA';

export interface Pedido {
  id: string;
  orderCode: string;
  obraId: string;
  obraNome: string;
  solicitante: string;
  data: string;
  prioridade: PedidoPriority;
  status: 'PENDENTE' | 'APROVADO' | 'CONCLUÍDO' | 'REJEITADO';
  itens: { 
    materialId: string; 
    nome: string; 
    quantidade: number; 
    unidade: string;
    valorUnitario: number;
    total: number; 
    observacao?: string;
  }[];
  observacoes?: string;
  subtotal: number;
}

export interface Supplier {
  id: string;
  companyName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  phone: string;
  email: string;
  website?: string;
  zipCode: string;
  address: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  categories: string[];
  averageDeliveryDays: number;
  paymentTerms: string;
  status: 'ativo' | 'inativo';
}

export interface Empresa {
  id: string;
  nome: string;
  dataCadastro: string;
  status: 'ativa' | 'inativa';
  totalPedidos: number;
}
