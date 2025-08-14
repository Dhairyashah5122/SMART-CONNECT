
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Bell, Settings, UserCog, FolderCheck, Send, BarChart, FilePlus2, UserCheck, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Oversee platform activities and manage system settings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Users" value="150" icon={Users} />
        <StatCard title="Active Projects" value="5" icon={Briefcase} />
        <StatCard title="Pending Approvals" value="2" icon={Bell} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform efficiently.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
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
             <Link href="/admin/roles" passHref>
                <Button variant="outline" className="w-full justify-start">
                    <KeyRound className="mr-2" />
                    Manage User Roles
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions from users.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
