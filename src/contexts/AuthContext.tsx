import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'parkvision_auth_user';

const MOCK_ADMIN_CREDENTIALS = {
  email: 'admin@parkvision.hu',
  password: 'admin123',
  name: 'Admin User',
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (
      email === MOCK_ADMIN_CREDENTIALS.email &&
      password === MOCK_ADMIN_CREDENTIALS.password
    ) {
      const loggedInUser = {
        email: MOCK_ADMIN_CREDENTIALS.email,
        name: MOCK_ADMIN_CREDENTIALS.name,
      };
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
