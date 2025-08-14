import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase, Calendar, FileText, MessageSquare } from 'lucide-react';

export default function MentorDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="My Mentees" value="5" icon={Users} />
        <StatCard title="Active Projects" value="3" icon={Briefcase} />
        <StatCard title="Upcoming Meetings" value="2" icon={Calendar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Mentees</CardTitle>
            <CardDescription>Your assigned students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40" />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Aisha Khan</p>
                  <p className="text-sm text-muted-foreground">AI-Powered Data Visualization</p>
                </div>
              </div>
              <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
            </div>
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40" />
                  <AvatarFallback>BC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Ben Carter</p>
                  <p className="text-sm text-muted-foreground">Mobile-First E-commerce App</p>
                </div>
              </div>
              <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button variant="outline" className="justify-start">
              <Users className="mr-2" />
              View Mentees
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2" />
              Schedule a Meeting
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="mr-2" />
              Submit a Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
