
import { 
  ClipboardList, 
  CheckCircle, 
  Building2, 
  FileText, 
  Truck, 
  History 
} from 'lucide-react';
import { Feature, Obra, Material, Pedido, Empresa, User, Supplier } from './types';

export const VIDEO_HERO_URL = 'https://fkzsuhanabiovnslzwfj.supabase.co/storage/v1/object/public/assets/video-hero.mp4';

export const FEATURES: Feature[] = [
  { id: '1', title: 'Gestão de Pedidos', description: 'Acompanhe cada solicitação de material em tempo real.', icon: ClipboardList },
  { id: '2', title: 'Aprovação Centralizada', description: 'Fluxo inteligente para gestores garantirem o compliance.', icon: CheckCircle },
  { id: '3', title: 'Controle por Obra', description: 'Separação clara de custos por centro de custo.', icon: Building2 },
  { id: '4', title: 'Exportação em PDF', description: 'Gere relatórios profissionais prontos para envio.', icon: FileText },
  { id: '5', title: 'Envio para Fornecedores', description: 'Comunicação organizada com sua rede homologada.', icon: Truck },
  { id: '6', title: 'Histórico Completo', description: 'Auditoria total de todas as movimentações no sistema.', icon: History },
];

export const MOCK_OBRAS: Obra[] = [
  { id: '1', nome: 'Residencial Aurora', endereco: 'Av. Paulista, 1000', orcamento: 500000 },
  { id: '2', nome: 'Edifício Horizonte', endereco: 'Rua das Flores, 450', orcamento: 1200000 },
];

export const MATERIAL_CATEGORIES = [
  'Cimento', 'Areia', 'Brita', 'Aço', 'Elétrico', 'Hidráulico', 'Acabamento', 'Outro'
];

export const MATERIAL_UNITS = [
  'UN', 'KG', 'M', 'M²', 'M³', 'L'
];

export const PAYMENT_TERMS = [
  'À vista', '7 dias', '15 dias', '30 dias', '45 dias'
];

export const STATES_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const MOCK_MATERIAIS: Material[] = [
  { 
    id: '1', 
    nome: 'Cimento CP-II', 
    codigoInterno: 'CIM-001',
    categoria: 'Cimento',
    unidade: 'KG', 
    quantidadeAtual: 1500,
    estoqueMinimo: 500,
    localizacao: 'Galpão A - Setor 1',
    valorUnitario: 35.50,
    status: 'ativo'
  },
  { 
    id: '2', 
    nome: 'Areia Lavada', 
    codigoInterno: 'ARE-012',
    categoria: 'Areia',
    unidade: 'M³', 
    quantidadeAtual: 5,
    estoqueMinimo: 10,
    localizacao: 'Pátio Externo',
    valorUnitario: 110.00,
    status: 'ativo'
  },
  { 
    id: '3', 
    nome: 'Brita 1', 
    codigoInterno: 'BRI-005',
    categoria: 'Brita',
    unidade: 'M³', 
    quantidadeAtual: 20,
    estoqueMinimo: 15,
    localizacao: 'Pátio Externo',
    valorUnitario: 95.00,
    status: 'ativo'
  },
  { 
    id: '4', 
    nome: 'Aço CA-50 10mm', 
    codigoInterno: 'ACO-088',
    categoria: 'Aço',
    unidade: 'M', 
    quantidadeAtual: 100,
    estoqueMinimo: 200,
    localizacao: 'Almoxarifado B',
    valorUnitario: 68.90,
    status: 'ativo'
  },
];

export const MOCK_FORNECEDORES: Supplier[] = [
  {
    id: 'S1',
    companyName: 'Forte Mix Cimentos S.A.',
    tradeName: 'Forte Mix',
    cnpj: '12.345.678/0001-99',
    stateRegistration: '123456789',
    phone: '(11) 4002-8922',
    email: 'vendas@fortemix.com.br',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    address: 'Av. Industrial',
    number: '1500',
    district: 'Lapa',
    categories: ['Cimento', 'Areia'],
    averageDeliveryDays: 3,
    paymentTerms: '30 dias',
    status: 'ativo'
  },
  {
    id: 'S2',
    companyName: 'Gerdau Aços Brasil',
    tradeName: 'Gerdau',
    cnpj: '98.765.432/0001-11',
    stateRegistration: '987654321',
    phone: '(21) 3344-5566',
    email: 'contato@gerdau.com.br',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '20000-000',
    address: 'Rua do Aço',
    number: '50',
    district: 'Centro',
    categories: ['Aço'],
    averageDeliveryDays: 5,
    paymentTerms: '15 dias',
    status: 'ativo'
  }
];

export const MOCK_PEDIDOS: Pedido[] = [
  { 
    id: 'P001', 
    orderCode: '1302_15452391',
    obraId: '1', 
    obraNome: 'Residencial Aurora', 
    solicitante: 'Ricardo Souza',
    data: '2023-10-25', 
    prioridade: 'MÉDIA',
    status: 'PENDENTE', 
    subtotal: 710,
    itens: [{ materialId: '1', nome: 'Cimento CP-II', unidade: 'KG', valorUnitario: 35.50, quantidade: 20, total: 710 }] 
  },
  { 
    id: 'P002', 
    orderCode: '1202_09104522',
    obraId: '2', 
    obraNome: 'Edifício Horizonte', 
    solicitante: 'Ana Paula',
    data: '2023-10-24', 
    prioridade: 'ALTA',
    status: 'APROVADO', 
    subtotal: 3445,
    itens: [{ materialId: '4', nome: 'Aço CA-50', unidade: 'M', valorUnitario: 68.90, quantidade: 50, total: 3445 }] 
  },
];

export const MOCK_SYSTEM_USERS: User[] = [
  { id: 'U1', name: 'Ricardo Souza', email: 'ricardo@pedobra.com', role: 'admin', status: 'ativo', permissions: { aprovarPedidos: true, editarMateriais: true, visualizarFinanceiro: true } },
  // Fix: changed 'usuario' to 'user' to match UserRole type
  { id: 'U2', name: 'Ana Paula', email: 'ana.paula@pedobra.com', role: 'user', status: 'ativo', permissions: { aprovarPedidos: false, editarMateriais: false, visualizarFinanceiro: false } },
  // Fix: changed 'usuario' to 'user' to match UserRole type
  { id: 'U3', name: 'Roberto Silva', email: 'roberto@pedobra.com', role: 'user', status: 'inativo', permissions: { aprovarPedidos: false, editarMateriais: true, visualizarFinanceiro: false } },
];

export const MOCK_EMPRESAS: Empresa[] = [
  { id: 'E1', nome: 'Construtora Forte Ltda', dataCadastro: '2023-01-15', status: 'ativa', totalPedidos: 145 },
  { id: 'E2', nome: 'Engenharia Moderna S.A.', dataCadastro: '2023-05-20', status: 'ativa', totalPedidos: 88 },
  { id: 'E3', nome: 'Obras Rápidas ME', dataCadastro: '2023-08-10', status: 'inativa', totalPedidos: 12 },
];
