import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import { ObrasPage, UserDashboard } from './pages/DashboardPages';
import UsuariosPage from './pages/UsuariosPage';
import MateriaisPage from './pages/MateriaisPage';
import PedidosPage from './pages/PedidosPage';
import FornecedoresPage from './pages/FornecedoresPage';

const Router: React.FC = () => {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  const [view, setView] = useState<'landing' | 'login' | 'register'>(
    location.pathname === '/register' ? 'register' : 'landing'
  );
  const [activeTab, setActiveTab] = useState('');

  // Passo 5: Diagnóstico de variáveis de ambiente
  useEffect(() => {
    console.log("ENV Check - Supabase URL:", import.meta.env.VITE_SUPABASE_URL ? "Configurada" : "Indefinida");
  }, []);

  // Sincroniza a view com a URL atual
  useEffect(() => {
    if (location.pathname === '/register') setView('register');
    else if (location.pathname === '/login') setView('login');
    else if (location.pathname === '/' || location.pathname === '/landing') setView('landing');
  }, [location.pathname]);

  // Sincroniza a aba inicial baseada no papel do usuário
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') setActiveTab('dash');
      else setActiveTab('obra-dash');
    }
  }, [user, role]);

  // 1. Se estiver carregando (sessão ou role), não renderiza nada
  if (loading) return null;

  // Permite acesso ao registro mesmo se estiver logado (para o fluxo secreto do admin)
  if (view === 'register') return <LoginPage initialRegister={true} />;

  // 2. Se não houver usuário, renderiza Landing ou Login
  if (!user) {
    if (view === 'login') return <LoginPage />;
    
    return (
      <div className="min-h-screen selection:bg-[#F97316] selection:text-white">
        <Header onLoginClick={() => setView('login')} />
        <main>
          <Hero onActionClick={() => setView('login')} />
          <FeaturesSection />
        </main>
        <footer className="bg-[#0B0B0B] py-12 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-extrabold tracking-tighter text-white">
              Ped<span className="text-[#F97316]">Obra</span>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} PedObra Sistemas. Industrial MVP.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // 3. Se houver usuário e role carregado, renderiza o Sistema Protegido
  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'obras': return <ObrasPage />;
      case 'usuarios': return <UsuariosPage />;
      case 'materiais': return <MateriaisPage />;
      case 'fornecedores': return <FornecedoresPage />;
      case 'pedidos': 
      case 'obra-pedidos': return <PedidosPage />;
      case 'obra-dash': return <UserDashboard />;
      case 'dash': return (
        <div className="space-y-8 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <div className="w-24 h-24 rounded-full bg-orange-500"></div>
              </div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Pendentes</p>
              <p className="text-5xl font-black mt-3 text-orange-500">12</p>
            </div>
            <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <div className="w-24 h-24 rounded-full bg-green-500"></div>
              </div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Aprovados</p>
              <p className="text-5xl font-black mt-3 text-green-500">45</p>
            </div>
            <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <div className="w-24 h-24 rounded-full bg-blue-500"></div>
              </div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Obra Ativa</p>
              <p className="text-5xl font-black mt-3 text-blue-500">8</p>
            </div>
          </div>
          <PedidosPage />
        </div>
      );
      default: return <div className="p-20 text-center text-gray-500 uppercase font-black tracking-tighter text-4xl opacity-10">Selecione um módulo</div>;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <Router />
  </AuthProvider>
);

export default App;