"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation'; // Para redirecionamento

// Interface para o objeto de usuário (simplificada)
interface User {
  id: string;
  name: string;
  email: string;
  roles: string[]; // Ex: ['ADMIN', 'USER']
  // Adicionar outros campos relevantes do usuário
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (userData: User) // Simulação de login
    => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean; // Exemplo, pode ser baseado em roles
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const router = useRouter();

  // Simulação de verificação de autenticação no carregamento
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      // Aqui você faria uma chamada à API para verificar se o usuário está logado
      // ou leria de um localStorage/cookie seguro (HttpOnly)
      // Exemplo:
      // try {
      //   const response = await fetch('/api/auth/me'); // Endpoint que retorna o usuário logado
      //   if (response.ok) {
      //     const userData = await response.json();
      //     setUser(userData);
      //   } else {
      //     setUser(null);
      //   }
      // } catch (error) {
      //   setUser(null);
      // }

      // Simulação:
      const storedUser = localStorage.getItem('currentUser_simulated');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    // Em uma aplicação real, isso viria após uma chamada de API bem-sucedida
    // e o token JWT seria armazenado de forma segura (ex: cookie HttpOnly)
    setUser(userData);
    localStorage.setItem('currentUser_simulated', JSON.stringify(userData)); // Simulação
    // router.push('/'); // Redirecionar para home ou dashboard
  };

  const logout = () => {
    // Chamar API de logout, limpar token, etc.
    setUser(null);
    localStorage.removeItem('currentUser_simulated'); // Simulação
    // router.push('/login');
  };

  const isAdmin = user?.roles?.includes('ADMIN') || false;

  const hasPermission = (permission: string): boolean => {
    // Lógica de verificação de permissão baseada em roles ou permissões mais granulares
    // Exemplo simples:
    if (!user) return false;
    return user.roles?.includes(permission.toUpperCase()); // Supondo que permissões sejam roles
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
