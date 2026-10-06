import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: { id: string; email: string; name: string } | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateAdminState: (email?: string, name?: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  admin: null,
  login: async () => {},
  logout: () => {},
  updateAdminState: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [admin, setAdmin] = useState<{ id: string; email: string; name: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('craftnest_admin_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.checkAuth()
      .then(res => {
        setIsAuthenticated(true);
        setAdmin(res.admin);
      })
      .catch(() => {
        localStorage.removeItem('craftnest_admin_token');
        setIsAuthenticated(false);
        setAdmin(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('craftnest_admin_token', res.token);
    setIsAuthenticated(true);
    setAdmin(res.admin);
  };

  const logout = () => {
    localStorage.removeItem('craftnest_admin_token');
    setIsAuthenticated(false);
    setAdmin(null);
  };

  const updateAdminState = (email?: string, name?: string) => {
    if (admin) {
      setAdmin({
        ...admin,
        email: email || admin.email,
        name: name || admin.name
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, admin, login, logout, updateAdminState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
