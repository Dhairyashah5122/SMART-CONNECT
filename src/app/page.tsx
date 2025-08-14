import { StatCard } from '@/components/dashboard/stat-card';
import { SurveyResponseChart } from '@/components/dashboard/survey-response-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { surveyData, students, projects } from '@/lib/data';
import { Activity, Users, ClipboardList, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const totalStudents = students.length;
  const totalProjects = projects.length;
  const totalSurveys = surveyData.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Students" value={totalStudents} icon={Users} />
        <StatCard title="Active Projects" value={totalProjects} icon={Briefcase} />
        <StatCard title="Surveys Completed" value={totalSurveys} icon={ClipboardList} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Survey Responses
            </CardTitle>
            <CardDescription>
              A visualization of survey responses over the last period.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SurveyResponseChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key areas of the application.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center gap-4">
            <Link href="/analysis" passHref>
              <Button asChild variant="outline" className="w-full justify-between">
                <a>
                  Run Comparative Analysis <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </Link>
            <Link href="/projects" passHref>
              <Button asChild variant="outline" className="w-full justify-between">
                <a>
                  Match Students to Projects <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </Link>
            <Link href="/surveys" passHref>
              <Button asChild className="w-full justify-between bg-accent text-accent-foreground hover:bg-accent/90">
                <a>
                  Administer Surveys <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
