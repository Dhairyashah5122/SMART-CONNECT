"use client";

import { useAuth } from '@/lib/auth';
import { MainLayout } from './main-layout';
import { usePathname } from 'next/navigation';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  
  // Routes that should not use the main layout (login, signup, etc.)
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(pathname);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading SMART CONNECTION...</p>
        </div>
      </div>
    );
  }

  // If it's an auth route or user is not logged in, don't wrap with MainLayout
  if (isAuthRoute || !user) {
    return <>{children}</>;
  }

  // For authenticated users on protected routes, wrap with MainLayout
  return <MainLayout>{children}</MainLayout>;
}