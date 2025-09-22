"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, BarChart, FileText, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // This will be handled by AppWrapper redirect
  }

  const getRoleSpecificWelcome = () => {
    switch (user?.role) {
      case 'admin':
        return 'Manage the entire platform, oversee users, and generate system-wide reports.';
      case 'company':
        return 'Manage your projects, review reports, and analyze company-specific survey data.';
      case 'mentor':
        return 'Guide students, manage mentorship programs, and track mentee progress.';
      case 'student':
        return 'Access your personalized dashboard, track progress, and manage projects.';
      default:
        return 'An integrated platform for survey analysis, student-project matching, and comparative insights.';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          {getRoleSpecificWelcome()}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="capitalize">{user?.role} Account</span>
          <span>•</span>
          <span>{user?.email}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> For Students & Mentors</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">Access your personalized dashboard to track progress, manage projects, and view matches.</p>
          </CardContent>
          <div className='flex-col items-start gap-4 p-6 pt-0'>
            <Button asChild className="w-full justify-between mb-2">
              <Link href="/student/dashboard">Student Dashboard <ArrowRight /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/mentor/dashboard">Mentor Dashboard <ArrowRight /></Link>
            </Button>
          </div>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="text-primary"/> For Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
             <p className="text-muted-foreground">Manage your projects, review reports, and analyze company-specific survey data.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full justify-between">
              <Link href="/companies">Company Hub <ArrowRight /></Link>
            </Button>
          </div>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> For Admins</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">Oversee the entire platform, manage users, and generate system-wide reports.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full justify-between">
              <Link href="/admin/dashboard">Admin Dashboard <ArrowRight /></Link>
            </Button>
          </div>
        </Card>
      </div>

    </div>
  );
}
