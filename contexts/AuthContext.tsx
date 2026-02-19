
import React, { createContext, useContext, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuth as useSupabaseAuth } from '../hooks/useAuth';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: string | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  signUp: (email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session, user: sbUser, role, loading, signIn, signUp: sbSignUp, signOut } = useSupabaseAuth();

  const user: User | null = sbUser ? {
    id: sbUser.id,
    name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Usuário',
    email: sbUser.email || '',
    role: (role as UserRole) || 'user',
    obraId: sbUser.user_metadata?.obraId,
    status: 'ativo',
  } : null;

  const login = async (email: string, pass: string) => {
    return await signIn(email, pass);
  };

  const signUp = async (email: string, pass: string) => {
    return await sbSignUp(email, pass);
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, session, loading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
