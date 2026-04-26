import React, { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { apiClient, getAuthToken, setAuthToken } from '../utils/apiClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'visitor';
}

export interface AuthError {
  code: 'invalid_credentials' | 'network' | 'unknown';
  message: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: AuthError }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState<boolean>(true);

  // On mount: if a token exists, ask the API who the user is.
  useEffect(() => {
    let mounted = true;
    const token = getAuthToken();
    if (!token) {
      setIsHydrating(false);
      return;
    }
    apiClient
      .get<{ user: AuthUser }>('/api/auth/me')
      .then((res) => {
        if (mounted) setUser(res.data.user);
      })
      .catch(() => {
        setAuthToken(null);
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setIsHydrating(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // React to global 401 events from the axios interceptor.
  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener('parkvision:unauthorized', handler);
    return () => window.removeEventListener('parkvision:unauthorized', handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiClient.post<{ token: string; user: AuthUser }>('/api/auth/login', {
        email,
        password,
      });
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return { ok: true } as const;
    } catch (err) {
      const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string; code?: string };
      if (error.response?.status === 401) {
        return {
          ok: false as const,
          error: { code: 'invalid_credentials' as const, message: error.response.data?.message ?? 'Hibás email cím vagy jelszó' },
        };
      }
      if (!error.response) {
        return {
          ok: false as const,
          error: { code: 'network' as const, message: 'Nem érhető el a szerver. Ellenőrizd a hálózatot.' },
        };
      }
      return {
        ok: false as const,
        error: { code: 'unknown' as const, message: error.response.data?.message ?? 'Ismeretlen bejelentkezési hiba' },
      };
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isHydrating,
      login,
      logout,
    }),
    [user, isHydrating, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
