import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScopeOutcomeChart } from '@/components/dashboard/scope-outcome-chart';
import { StudentSatisfactionChart } from '@/components/dashboard/student-satisfaction-chart';
import { ListChecks, Send } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {

  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
          <CardTitle>Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
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
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
         <div className="flex gap-4">
            <Button asChild className="w-full">
              <Link href="/student/dashboard">Student Dashboard</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/companies">Company Dashboard</Link>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Administration Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <div className="flex flex-col items-center gap-2">
                <ListChecks className="h-6 w-6" />
                <p className="text-sm">Track Responses</p>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Send className="h-6 w-6" />
                <p className="text-sm">Send Surveys</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
