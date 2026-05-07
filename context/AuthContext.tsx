import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

type User = {
  id?: number;
  email: string;
  nombre?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        if (savedToken) {
          setToken(savedToken);
          setUser({ email: '' });
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 segundos de timeout
      });

      const { token, user: userData } = response.data;

      await AsyncStorage.setItem('token', token);
      setToken(token);

      setUser({
        id: userData?.id,
        email: userData?.email || email,
        nombre: userData?.nombre
      });

    } catch (error: any) {
      console.error('Login error:', error.message);
      
      let errorMessage = 'Error al conectar con el servidor';
      
      if (error.response) {
        // Backend respondió con error
        errorMessage = error.response?.data?.error || error.response?.data?.message || 'Credenciales inválidas';
      } else if (error.request) {
        // No hay respuesta del servidor
        errorMessage = `No se pudo conectar al servidor en ${API_URL}. Verifica que el backend esté corriendo.`;
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = `Conexión rechazada en ${API_URL}. ¿El backend está corriendo?`;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
