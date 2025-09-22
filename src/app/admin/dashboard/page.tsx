
"use client";

import { useState, useEffect } from "react";
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Users, Settings, UserCog, FolderCheck, Send, BarChart, FilePlus2, UserCheck, GraduationCap, Building, Shield } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'company' | 'admin';
  lastLogin?: Date;
  createdAt: Date;
}

export default function AdminDashboardPage() {
  const { user, getUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    mentors: 0,
    companies: 0,
    admins: 0,
    recentLogins: 0
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userList = await getUsers();
      setUsers(userList);
      
      // Calculate stats
      const totalUsers = userList.length;
      const students = userList.filter(u => u.role === 'student').length;
      const mentors = userList.filter(u => u.role === 'mentor').length;
      const companies = userList.filter(u => u.role === 'company').length;
      const admins = userList.filter(u => u.role === 'admin').length;
      
      // Recent logins (last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentLogins = userList.filter(u => 
        u.lastLogin && new Date(u.lastLogin) > lastWeek
      ).length;

      setStats({
        totalUsers,
        students,
        mentors,
        companies,
        admins,
        recentLogins
      });
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Admin access required to view this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const recentUsers = users
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Oversee platform activities and manage system settings.</p>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers.toString()} icon={Users} />
        <StatCard title="Students" value={stats.students.toString()} icon={GraduationCap} />
        <StatCard title="Mentors" value={stats.mentors.toString()} icon={UserCheck} />
        <StatCard title="Companies" value={stats.companies.toString()} icon={Building} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform efficiently.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             <Link href="/admin/users" passHref>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2" />
                  User Management
                </Button>
            </Link>
             <Link href="/admin/approvals" passHref>
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="mr-2" />
                  Student Approvals
                </Button>
            </Link>
            <Link href="/students" passHref>
                <Button variant="outline" className="w-full justify-start">
                  <UserCog className="mr-2" />
                  Manage Students
                </Button>
            </Link>
             <Link href="/projects" passHref>
                <Button variant="outline" className="w-full justify-start">
                  <FolderCheck className="mr-2" />
                  Review Projects
                </Button>
            </Link>
             <Link href="/surveys" passHref>
                <Button variant="outline" className="w-full justify-start">
                    <Send className="mr-2" />
                    Send Surveys
                </Button>
            </Link>
             <Link href="/surveys/create" passHref>
                <Button variant="outline" className="w-full justify-start">
                    <FilePlus2 className="mr-2" />
                    Create Survey
                </Button>
            </Link>
             <Link href="/reports" passHref>
                <Button variant="outline" className="w-full justify-start">
                    <BarChart className="mr-2" />
                    Generate Reports
                </Button>
            </Link>
            <Link href="/admin/settings" passHref>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2" />
                System Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent users.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
