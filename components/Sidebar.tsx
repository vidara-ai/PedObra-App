import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Package, 
  ClipboardList, 
  Truck, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  // Lógica de acesso secreto: 5 cliques na logo redirecionam para /register (apenas para admins logados)
  useEffect(() => {
    if (clickCount === 5) {
      if (user?.role === 'admin') {
        setClickCount(0);
        navigate('/register');
      } else {
        setClickCount(0);
      }
    }

    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount, user?.role, navigate]);

  const menuItems = {
    admin: [
      { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'obras', label: 'Obras', icon: Building2 },
      { id: 'usuarios', label: 'Usuários', icon: Users },
      { id: 'materiais', label: 'Materiais', icon: Package },
      { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
      { id: 'fornecedores', label: 'Fornecedores', icon: Truck },
    ],
    user: [
      { id: 'obra-dash', label: 'Minha Obra', icon: Building2 },
      { id: 'obra-pedidos', label: 'Meus Pedidos', icon: ClipboardList },
    ],
  };

  const currentItems = menuItems[user?.role || 'user'];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-[#1A1A1A] min-h-screen border-r border-white/5 transition-all duration-300 flex flex-col z-40`}>
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        {!collapsed && (
          <div 
            onClick={() => setClickCount(prev => prev + 1)}
            className="text-xl font-black tracking-tighter text-white cursor-pointer select-none active:scale-95 transition-transform"
          >
            Ped<span className="text-[#F97316]">Obra</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-white/5 rounded-sm transition-colors text-[#F97316]">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        {currentItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center p-3 rounded-sm transition-all group ${
              activeTab === item.id 
                ? 'bg-[#F97316] text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={22} className={activeTab === item.id ? 'text-white' : 'text-[#F97316] group-hover:text-[#fb923c]'} />
            {!collapsed && <span className="ml-4 font-semibold text-sm">{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        {!collapsed && (
          <div className="mb-4 px-2">
            <p className="text-white text-xs font-bold uppercase truncate">{user?.name}</p>
            <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-widest">{user?.role}</p>
          </div>
        )}
        <button 
          onClick={logout}
          className={`w-full flex items-center p-3 rounded-sm text-red-500 hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={22} />
          {!collapsed && <span className="ml-4 font-bold text-sm">Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;