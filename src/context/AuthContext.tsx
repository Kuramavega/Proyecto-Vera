import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  municipio: string;
  alergias: string[];
  antecedentes: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (telefono: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuario mock con datos nicaragüenses
const mockUser: User = {
  id: '1',
  nombre: 'María Cristina González Herrera',
  cedula: '001-120890-0001C',
  telefono: '+505 8888 9999',
  email: 'maria.gonzalez@example.com',
  fechaNacimiento: '1990-08-12',
  municipio: 'Managua',
  alergias: ['Penicilina', 'Mariscos'],
  antecedentes: ['Hipertensión', 'Diabetes tipo 2']
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de sesión existente
    const savedUser = localStorage.getItem('saludcerca_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Simular tiempo de carga
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const login = async (telefono: string, password: string): Promise<boolean> => {
    // Simular autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validar credenciales (teléfono nicaragüense)
    if (telefono === '+505 8888 9999' && password === '123456') {
      setUser(mockUser);
      localStorage.setItem('saludcerca_user', JSON.stringify(mockUser));
      return true;
    }
    
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newUser: User = {
      id: Date.now().toString(),
      nombre: userData.nombre,
      cedula: userData.cedula,
      telefono: userData.telefono,
      email: userData.email,
      fechaNacimiento: userData.fechaNacimiento,
      municipio: userData.municipio,
      alergias: [],
      antecedentes: []
    };
    
    setUser(newUser);
    localStorage.setItem('saludcerca_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saludcerca_user');
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('saludcerca_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};