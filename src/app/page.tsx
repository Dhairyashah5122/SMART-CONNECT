import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScopeOutcomeChart } from '@/components/dashboard/scope-outcome-chart';
import { StudentSatisfactionChart } from '@/components/dashboard/student-satisfaction-chart';
import { CompanySatisfactionChart } from '@/components/dashboard/company-satisfaction-chart';
import Link from 'next/link';
import { ArrowRight, BarChart, FileText, Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to SynergyScope</h1>
        <p className="text-muted-foreground">An integrated platform for survey analysis, student-project matching, and comparative insights.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Gap Analysis Overview</CardTitle>
          <CardDescription>A high-level view of project scope vs. outcomes and stakeholder satisfaction.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Scope vs. Outcome</CardTitle>
              </CardHeader>
              <CardContent>
                <ScopeOutcomeChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Student Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <StudentSatisfactionChart />
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Company Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <CompanySatisfactionChart />
              </CardContent>
            </Card>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> For Students & Mentors</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">Access your personalized dashboard to track progress, manage projects, and view matches.</p>
          </CardContent>
          <CardFooter className='flex-col items-start gap-4'>
            <Button asChild className="w-full justify-between">
              <Link href="/student/dashboard">Student Dashboard <ArrowRight /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/mentor/dashboard">Mentor Dashboard <ArrowRight /></Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="text-primary"/> For Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
             <p className="text-muted-foreground">Manage your projects, review reports, and analyze company-specific survey data.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full justify-between">
              <Link href="/companies">Company Hub <ArrowRight /></Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> For Admins</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">Oversee the entire platform, manage users, and generate system-wide reports.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full justify-between">
              <Link href="/admin/dashboard">Admin Dashboard <ArrowRight /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}
