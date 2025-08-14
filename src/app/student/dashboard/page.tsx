import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, CheckSquare, Trophy, User, FileText, ExternalLink } from 'lucide-react';
import { students, projects } from '@/lib/data';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const student = students[0];
  const project = projects.find(p => p.id === student.projectId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${student.id}`} data-ai-hint="person" />
          <AvatarFallback>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Welcome, {student.firstName}!</h1>
          <p className="text-muted-foreground">Here's your progress at a glance.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase /> My Project</CardTitle>
            <CardDescription>{project?.name || 'Not yet assigned'}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-2">Progress</p>
            <Progress value={60} className="mb-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Task 1: Setup environment</span>
              <span>Completed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Task 2: Data Preprocessing</span>
              <span>In Progress</span>
            </div>
             <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Task 3: Model Training</span>
              <span>Not Started</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy /> Achievements</CardTitle>
            <CardDescription>Milestones you've reached.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2 text-center p-4 bg-accent/20 rounded-lg">
                <Trophy className="h-8 w-8 text-accent" />
                <span className="text-xs font-semibold">First Milestone</span>
            </div>
             <div className="flex flex-col items-center gap-2 text-center p-4 bg-secondary rounded-lg">
                <CheckSquare className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs font-semibold">Task Master</span>
            </div>
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage your profile and project documents.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button>
              <User className="mr-2" /> View Profile
            </Button>
            <Link href={`/projects`}>
                <Button variant="secondary">
                <Briefcase className="mr-2" /> View Project Details
                </Button>
            </Link>
            <Link href="/surveys" legacyBehavior>
                <Button variant="outline">
                    <FileText className="mr-2" /> Complete Surveys
                    <ExternalLink className="ml-2 h-4 w-4 text-muted-foreground"/>
                </Button>
            </Link>
          </CardContent>
        </Card>
    </div>
  );
}
