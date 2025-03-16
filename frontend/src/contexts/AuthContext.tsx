import { createContext, use, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { User } from '@/data/User';
import { env } from '@/config/env';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${env.VITE_MOCKAGRAM_API_URL}/users/me`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const userData = await response.json() as User;
            setUser(userData);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      };

      void checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await fetch(`${env.VITE_MOCKAGRAM_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json() as User;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${env.VITE_MOCKAGRAM_API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    login,
    logout
  }), [user, login, logout]);

  return (
    <AuthContext value={contextValue}>
      {children}
    </AuthContext>
  );
}

// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
