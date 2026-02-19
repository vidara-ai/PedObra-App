
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Loader2, Key, Shield, User as UserIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';
import { User, UserRole } from '../types';

// Fix: Complete the component definition and add the default export to resolve "no default export" and "not assignable to FC" errors.
const UsuariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [users, setUsers] = useState<User[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: 'user' as UserRole,
  });

  const [error, setError] = useState<string | null>(null);

  // Verificação de acesso: Apenas administradores podem acessar esta página
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        navigate('/');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        navigate('/');
      }
    };

    checkAccess();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoadingList(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('nome');
      
      if (!error && data) {
        const mappedUsers: User[] = data.map((p: any) => ({
          id: p.id,
          name: p.nome,
          email: p.email || 'Acesso Gerado',
          role: p.role as UserRole,
          status: 'ativo'
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.error('Erro ao listar usuários:', err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (view === 'list') fetchUsers();
  }, [view]);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 14; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, senha: password }));
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingSubmit(true);

    try {
      // Cria o usuário no Auth usando a API Admin (mesma lógica da página secreta)
      // Nota: auth.admin requer privilégios de service_role que podem não estar no anon client.
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.senha,
        email_confirm: true,
        user_metadata: { name: formData.nome, role: formData.perfil }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado.');
      }

      // Cria registro na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          nome: formData.nome,
          email: formData.email,
          role: formData.perfil
        });

      if (profileError) {
        throw new Error(profileError.message);
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setView('list');
      setFormData({ nome: '', email: '', senha: '', perfil: 'user' });

    } catch (err: any) {
      console.error('Falha no cadastro:', err);
      setError(err.message || 'Erro inesperado ao criar usuário.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderList = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-white uppercase">USUÁRIOS</h3>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Gestão centralizada de acessos</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="flex items-center gap-2 bg-[#F97316] text-white px-6 py-4 rounded-lg font-bold uppercase tracking-widest shadow-xl shadow-orange-500/10 hover:bg-[#fb923c] transition-all active:scale-95"
        >
          <Plus size={20} /> Novo Usuário
        </button>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden min-h-[400px]">
        {loadingList ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#F97316]" size={40} />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#0B0B0B] text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Usuário</th>
                <th className="px-8 py-5">Perfil</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center border border-white/5 text-[#F97316]">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#F97316] transition-colors">{user.name}</p>
                        <p className="text-gray-500 text-[10px] font-mono">{user.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-widest ${user.role === 'admin' ? 'text-white' : 'text-gray-500'}`}>
                      <Shield size={12} className={user.role === 'admin' ? 'text-[#F97316]' : 'text-gray-600'} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">CADASTRO DE USUÁRIO</h3>
          <p className="text-xs font-bold text-[#F97316] tracking-widest uppercase mt-1">Criação via Painel Admin</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={18} />
          <p className="text-red-500 text-[11px] font-black uppercase tracking-wider">{error}</p>
        </div>
      )}

      <form onSubmit={handleSaveUser} className="space-y-6">
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Nome Completo</label>
              <input 
                type="text" required
                value={formData.nome}
                onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome do colaborador"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">E-mail Corporativo</label>
              <input 
                type="email" required
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Senha de Acesso</label>
              <div className="relative">
                <input 
                  type="text" required
                  value={formData.senha}
                  onChange={e => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all font-mono"
                  placeholder="Senha temporária"
                />
                <button 
                  type="button"
                  onClick={generatePassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F97316] hover:text-[#fb923c] transition-colors"
                  title="Gerar senha aleatória"
                >
                  <Key size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Perfil de Acesso</label>
              <select 
                value={formData.perfil}
                onChange={e => setFormData(prev => ({ ...prev, perfil: e.target.value as UserRole }))}
                className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] appearance-none cursor-pointer"
              >
                <option value="user">Colaborador (User)</option>
                <option value="admin">Administrador (Admin)</option>
              </select>
            </div>
          </div>
        </div>

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
            disabled={loadingSubmit}
            className="flex-[2] h-16 bg-[#F97316] text-white font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#fb923c] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none group"
          >
            {loadingSubmit ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} className="group-hover:scale-110 transition-transform" />}
            {loadingSubmit ? 'Criando...' : 'Criar Usuário'}
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
            <div className="bg-[#F97316] rounded-full p-1.5 flex items-center justify-center text-white">
              <Check size={14} />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-wider">Usuário Criado</p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-0.5">Acesso habilitado no sistema.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
