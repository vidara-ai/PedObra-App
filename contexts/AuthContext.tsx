import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { User, UserRole } from '../types';

type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  user: User | null;
  role: string | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  signUp: (email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('initializing');

  const fetchProfileRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return 'user';
      }
      return data?.role || 'user';
    } catch (err) {
      console.error('Erro crítico ao buscar perfil:', err);
      return 'user';
    }
  };

  const mapUser = (sbUser: SupabaseUser, userRole: string): User => ({
    id: sbUser.id,
    name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Usuário',
    email: sbUser.email || '',
    role: (userRole as UserRole) || 'user',
    obraId: sbUser.user_metadata?.obraId,
    status: 'ativo',
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setStatus('initializing');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.user) {
          setUser(null);
          setRole(null);
          setStatus('unauthenticated');
          return;
        }

        const userRole = await fetchProfileRole(session.user.id);
        setUser(mapUser(session.user, userRole));
        setRole(userRole);
        setStatus('authenticated');
      } catch (err) {
        console.error('Erro crítico no AuthProvider initialize:', err);
        setStatus('unauthenticated');
      }
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (!session?.user) {
          setUser(null);
          setRole(null);
          setStatus('unauthenticated');
          return;
        }

        const userRole = await fetchProfileRole(session.user.id);
        setUser(mapUser(session.user, userRole));
        setRole(userRole);
        setStatus('authenticated');
      } catch (err) {
        console.error('Erro no listener de auth:', err);
        setStatus('unauthenticated');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error };
  };

  const signUp = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: { role: 'user' }
      }
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      status,
      isAuthenticated: status === 'authenticated',
      isInitializing: status === 'initializing',
      login,
      signUp,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};