"use client";

import { useAuth } from '@/lib/auth';
import { MainLayout } from './main-layout';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
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

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!isLoading && !user && !isAuthRoute) {
      router.push('/login');
    }
  }, [user, isLoading, isAuthRoute, router]);

  // If it's an auth route, don't wrap with MainLayout
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // If user is not logged in and not on auth route, show loading while redirecting
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // For authenticated users on protected routes, wrap with MainLayout
  return <MainLayout>{children}</MainLayout>;
}
