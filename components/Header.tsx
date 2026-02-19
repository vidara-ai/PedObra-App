import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verificar role do usuário para o acesso secreto
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data?.role === 'admin') {
        setIsAdmin(true);
      }
    };
    checkUserRole();
  }, []);

  // Controle de cliques secretos no Header
  useEffect(() => {
    if (clickCount === 5 && isAdmin) {
      navigate('/register');
      setClickCount(0);
    }

    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount, isAdmin, navigate]);

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-12 ${
      isScrolled ? 'bg-[#0B0B0B]/95 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          onClick={() => {
            if (isAdmin) setClickCount(prev => prev + 1);
          }}
          className="text-2xl font-extrabold tracking-tighter text-white cursor-pointer select-none"
        >
          Ped<span className="text-[#F97316]">Obra</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide uppercase">
          <a href="#funcionalidades" onClick={scrollToFeatures} className="text-gray-300 hover:text-white transition-colors">
            Funcionalidades
          </a>
          <button onClick={onLoginClick} className="text-gray-300 hover:text-white transition-colors">
            Login
          </button>
          <button 
            onClick={onLoginClick}
            className="bg-[#F97316] text-white px-6 py-2.5 rounded-sm hover:bg-[#fb923c] transition-all duration-200 active:scale-95 shadow-md"
          >
            Acessar Sistema
          </button>
        </nav>

        <div className="md:hidden">
           <button onClick={onLoginClick} className="text-[#F97316] font-bold text-sm">LOGIN</button>
        </div>
      </div>
    </header>
  );
};

export default Header;