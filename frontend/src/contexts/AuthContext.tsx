import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import { setAuthToken, getAuthToken } from '../api/client';
import type { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  mustChangePassword: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function hasToken() {
  return getAuthToken() !== null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Only start in loading state if there is a token to validate
  const [loading, setLoading] = useState(hasToken);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch {
      setUser(null);
      setAuthToken(null);
    }
  }, []);

  useEffect(() => {
    // If there's no token, loading was already initialized as false
    if (!hasToken()) return;

    let cancelled = false;

    authApi
      .me()
      .then((userData) => {
        if (!cancelled) setUser(userData);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setAuthToken(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    setAuthToken(response.access_token);
    const userData = await authApi.me();
    setUser(userData);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        mustChangePassword: user?.mustChangePassword ?? false,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
