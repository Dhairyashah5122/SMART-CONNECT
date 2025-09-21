"use client";

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuth } from 'google-auth-library';

// Export types for use in other components
export type UserRole = 'student' | 'mentor' | 'company' | 'admin';
export type UserProvider = 'email' | 'google' | 'microsoft' | 'westcliff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  provider: UserProvider;
  permissions: string[];
  lastLogin?: Date;
  createdAt: Date;
}
import { useRouter, usePathname } from 'next/navigation';
import { GoogleAuth } from 'google-auth-library';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'mentor' | 'company' | 'admin';
  avatar?: string;
  provider?: 'email' | 'google' | 'westcliff' | 'microsoft';
  createdAt: Date;
  lastLogin: Date;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithSSO: (provider: string) => Promise<boolean>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database - in real app this would be in your backend
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@westcliff.edu',
    name: 'Admin User',
    role: 'admin',
    provider: 'email',
    createdAt: new Date('2025-01-01'),
    lastLogin: new Date(),
    permissions: ['user_management', 'system_settings', 'reports', 'all_access']
  },
  {
    id: '2', 
    email: 'student@westcliff.edu',
    name: 'John Student',
    role: 'student',
    provider: 'email',
    createdAt: new Date('2025-02-15'),
    lastLogin: new Date(),
    permissions: ['profile_edit', 'projects_view']
  },
  {
    id: '3',
    email: 'mentor@westcliff.edu', 
    name: 'Sarah Mentor',
    role: 'mentor',
    provider: 'westcliff',
    createdAt: new Date('2025-01-20'),
    lastLogin: new Date(),
    permissions: ['profile_edit', 'student_management', 'projects_manage']
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password'];

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage or session)
    const checkAuth = () => {
      const storedUser = localStorage.getItem('smart_connection_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Update last login
        userData.lastLogin = new Date();
        setUser(userData);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      if (!user && !publicRoutes.includes(pathname)) {
        // Not authenticated and trying to access private route
        router.push('/login');
      } else if (user && pathname === '/login') {
        // Already authenticated and trying to access login page
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock database or create new one
    let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      // Create new user for demo purposes
      foundUser = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 
              email.includes('company') ? 'company' : 
              email.includes('mentor') ? 'mentor' : 'student',
        provider: 'email',
        createdAt: new Date(),
        lastLogin: new Date(),
        permissions: email.includes('admin') ? ['user_management', 'system_settings', 'reports', 'all_access'] : ['profile_edit']
      };
      setUsers(prev => [...prev, foundUser!]);
    }

    foundUser.lastLogin = new Date();
    setUser(foundUser);
    localStorage.setItem('smart_connection_user', JSON.stringify(foundUser));
    setIsLoading(false);
    
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Google user data
      const googleUser: User = {
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'student',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        provider: 'google',
        createdAt: new Date(),
        lastLogin: new Date(),
        permissions: ['profile_edit', 'projects_view']
      };

      setUser(googleUser);
      localStorage.setItem('smart_connection_user', JSON.stringify(googleUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const loginWithSSO = async (provider: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate SSO flow
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const ssoUser: User = {
        id: `${provider}_${Date.now()}`,
        email: `user@${provider}.edu`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        role: 'student',
        provider: provider as any,
        createdAt: new Date(),
        lastLogin: new Date(),
        permissions: ['profile_edit', 'projects_view']
      };

      setUser(ssoUser);
      localStorage.setItem('smart_connection_user', JSON.stringify(ssoUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smart_connection_user');
    router.push('/login');
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<boolean> => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      
      setUsers(prev => [...prev, newUser]);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...userData } : user
      ));
      
      // Update current user if it's being modified
      if (user && user.id === userId) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('smart_connection_user', JSON.stringify(updatedUser));
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users,
      login, 
      loginWithGoogle,
      loginWithSSO,
      logout, 
      addUser,
      updateUser,
      deleteUser,
      isLoading 
    }}>
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

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading SMART CONNECTION...</p>
          </div>
        </div>
      );
    }
    
    if (!user) {
      return null; // AuthProvider will handle redirect
    }
    
    return <Component {...props} />;
  };
}