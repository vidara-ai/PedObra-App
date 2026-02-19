import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle, ChevronRight } from 'lucide-react';

interface LoginPageProps {
  initialRegister?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ initialRegister = false }) => {
  const navigate = useNavigate();
  const { login, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para o acesso oculto
  const [clickCount, setClickCount] = useState(0);

  // Controle de cliques e redirecionamento via React Router
  useEffect(() => {
    if (clickCount === 5) {
      navigate('/register');
      setClickCount(0);
    }

    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const action = isRegister ? signUp : login;
      const { error: authError } = await action(email, password);
      
      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          setError('E-mail ou senha incorretos.');
        } else if (authError.message === 'User already registered') {
          setError('Este e-mail já está cadastrado.');
        } else {
          setError(authError.message);
        }
      } else if (isRegister) {
        setSuccess('Conta criada com sucesso! Verifique seu e-mail se necessário.');
      }
    } catch (err: any) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F97316] opacity-[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F97316] opacity-[0.02] rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 md:p-10 shadow-2xl animate-fade-in-up relative z-10">
        <div className="text-center mb-10">
          <div 
            onClick={() => setClickCount(prev => prev + 1)}
            className="text-4xl font-black tracking-tighter text-white mb-3 cursor-pointer select-none active:scale-95 transition-transform"
          >
            Ped<span className="text-[#F97316]">Obra</span>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
            {isRegister ? 'Criação de Conta Industrial' : 'Sistemas de Gestão Industrial'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-200">
            <AlertCircle className="text-red-500 shrink-0" size={18} />
            <p className="text-red-500 text-[11px] font-black uppercase tracking-wider">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-200">
            <AlertCircle className="text-green-500 shrink-0" size={18} />
            <p className="text-green-500 text-[11px] font-black uppercase tracking-wider">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all placeholder:text-gray-700"
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-[#0B0B0B] border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-[#F97316] transition-all placeholder:text-gray-700"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-[#F97316] hover:bg-[#fb923c] text-white font-black rounded-xl transition-all duration-300 active:scale-[0.98] shadow-xl shadow-orange-500/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Criar Conta' : 'Acessar Sistema'}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4 text-center">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            Ambiente Seguro & Monitorado
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;