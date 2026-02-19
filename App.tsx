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
  const { user, role, isInitializing, isAuthenticated } = useAuth();
  const location = useLocation();
  const [view, setView] = useState<'landing' | 'login' | 'register'>(
    location.pathname === '/register' ? 'register' : 'landing'
  );
  const [activeTab, setActiveTab] = useState('');

  // Sincroniza a view com a URL atual
  useEffect(() => {
    if (location.pathname === '/register') setView('register');
    else if (location.pathname === '/login') setView('login');
    else if (location.pathname === '/' || location.pathname === '/landing') setView('landing');
  }, [location.pathname]);

  // Sincroniza a aba inicial baseada no papel do usuário
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'admin') setActiveTab('dash');
      else setActiveTab('obra-dash');
    }
  }, [isAuthenticated, role]);

  // NUNCA retornar null. UI de carregamento pulsante.
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center p-6">
        <div className="text-4xl font-black tracking-tighter text-white mb-8 animate-pulse">
          Ped<span className="text-[#F97316]">Obra</span>
        </div>
        <div className="w-full max-w-[200px] flex flex-col items-center gap-3">
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#F97316] animate-progress"></div>
          </div>
          <p className="text-[#F97316] text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
            Inicializando sistema
          </p>
        </div>
        <style>{`
          @keyframes progress {
            0% { transform: translateX(-100%); width: 30%; }
            50% { width: 50%; }
            100% { transform: translateX(350%); width: 30%; }
          }
          .animate-progress {
            animation: progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}</style>
      </div>
    );
  }

  // Permite acesso ao registro (fluxo secreto)
  if (view === 'register') return <LoginPage initialRegister={true} />;

  // Se não estiver autenticado, Landing ou Login
  if (!isAuthenticated) {
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
              &copy; {new Date().getFullYear()} PedObra Sistemas. Industrial Premium.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Se estiver autenticado mas sem role definido ainda
  if (!role) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-gray-500 text-xs font-black uppercase tracking-widest animate-pulse">
          Carregando permissões...
        </div>
      </div>
    );
  }

  // Sistema Protegido
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
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-gray-700 uppercase font-black tracking-tighter text-4xl opacity-20">Aguardando Módulo</p>
        </div>
      );
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