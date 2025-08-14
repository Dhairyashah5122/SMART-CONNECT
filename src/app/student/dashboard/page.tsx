import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, CheckSquare, Trophy, User } from 'lucide-react';

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://placehold.co/80x80" />
          <AvatarFallback>SK</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Welcome, Student!</h1>
          <p className="text-muted-foreground">Here's your progress at a glance.</p>
        </div>
      </div>


      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase /> My Project</CardTitle>
            <CardDescription>AI-Powered Data Visualization Platform</CardDescription>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy /> Achievements</CardTitle>
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
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button>
              <User className="mr-2" /> View Profile
            </Button>
            <Button variant="secondary">
              <Briefcase className="mr-2" /> View Project Details
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
