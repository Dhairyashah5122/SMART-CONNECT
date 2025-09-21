"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithSSO: (provider: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  // User management functions
  getUsers: () => Promise<User[]>;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => Promise<User>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Demo',
    email: 'admin@smartconnection.edu',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin@smartconnection.edu',
    provider: 'email',
    permissions: ['read', 'write', 'delete', 'admin'],
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    name: 'John Student',
    email: 'student@smartconnection.edu',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?u=student@smartconnection.edu',
    provider: 'email',
    permissions: ['read'],
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date(),
  },
  {
    id: '3',
    name: 'Sarah Mentor',
    email: 'mentor@smartconnection.edu',
    role: 'mentor',
    avatar: 'https://i.pravatar.cc/150?u=mentor@smartconnection.edu',
    provider: 'email',
    permissions: ['read', 'write'],
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date(),
  },
  {
    id: '4',
    name: 'TechCorp Representative',
    email: 'company@smartconnection.edu',
    role: 'company',
    avatar: 'https://i.pravatar.cc/150?u=company@smartconnection.edu',
    provider: 'email',
    permissions: ['read', 'write'],
    createdAt: new Date('2023-03-01'),
    lastLogin: new Date(),
  },
  // Additional demo accounts for testing
  {
    id: '5',
    name: 'Alice Johnson',
    email: 'alice.johnson@westcliff.edu',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?u=alice.johnson@westcliff.edu',
    provider: 'email',
    permissions: ['read'],
    createdAt: new Date('2023-03-15'),
    lastLogin: new Date(),
  },
  {
    id: '6',
    name: 'Microsoft Corp',
    email: 'hiring@microsoft.com',
    role: 'company',
    avatar: 'https://i.pravatar.cc/150?u=hiring@microsoft.com',
    provider: 'microsoft',
    permissions: ['read', 'write'],
    createdAt: new Date('2023-02-20'),
    lastLogin: new Date(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const findUserByEmail = (email: string): User | undefined => {
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const getRolePermissions = (role: UserRole): string[] => {
    switch (role) {
      case 'admin':
        return ['read', 'write', 'delete', 'admin'];
      case 'mentor':
      case 'company':
        return ['read', 'write'];
      case 'student':
      default:
        return ['read'];
    }
  };

  const createUserFromEmail = (email: string): User => {
    const role: UserRole = email.includes('admin') ? 'admin' : 
                           email.includes('mentor') ? 'mentor' : 
                           email.includes('company') ? 'company' : 'student';
    
    return {
      id: Date.now().toString(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      provider: 'email',
      permissions: getRolePermissions(role),
      createdAt: new Date(),
      lastLogin: new Date(),
    };
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    let userData = findUserByEmail(email);
    if (!userData) {
      userData = createUserFromEmail(email);
      mockUsers.push(userData);
    }

    userData.lastLogin = new Date();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Google user
      const googleUser: User = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'student',
        avatar: 'https://i.pravatar.cc/150?u=user@gmail.com',
        provider: 'google',
        permissions: getRolePermissions('student'),
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      setUser(googleUser);
      localStorage.setItem('user', JSON.stringify(googleUser));
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const loginWithSSO = async (provider: string): Promise<boolean> => {
    try {
      // Simulate SSO
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const ssoUser: User = {
        id: `${provider}_` + Date.now(),
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user@${provider}.com`,
        role: 'student',
        avatar: `https://i.pravatar.cc/150?u=user@${provider}.com`,
        provider: provider as UserProvider,
        permissions: getRolePermissions('student'),
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      setUser(ssoUser);
      localStorage.setItem('user', JSON.stringify(ssoUser));
      return true;
    } catch (error) {
      console.error(`${provider} SSO login error:`, error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  // User management functions
  const getUsers = async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    return [...mockUsers];
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastLogin: new Date(),
      permissions: userData.permissions || getRolePermissions(userData.role),
    };

    mockUsers.push(newUser);
    return newUser;
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  };

  const deleteUser = async (userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers.splice(userIndex, 1);
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    loginWithSSO,
    logout,
    isLoading,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}