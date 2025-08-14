import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase, Calendar, FileText, MessageSquare, Award, History } from 'lucide-react';
import { mentors } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function MentorDashboardPage() {
  const mentor = mentors[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://placehold.co/80x80.png?text=${mentor.name.charAt(0)}`} />
          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{mentor.name}</h1>
          <p className="text-muted-foreground">Welcome to your Mentor Dashboard.</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="My Mentees" value={mentor.mentees.length} icon={Users} />
        <StatCard title="Active Projects" value="3" icon={Briefcase} />
        <StatCard title="Upcoming Meetings" value="2" icon={Calendar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Mentees</CardTitle>
            <CardDescription>Your assigned students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mentor.mentees.map(mentee => (
              <div key={mentee.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://placehold.co/40x40.png?text=${mentee.name.charAt(0)}`} />
                    <AvatarFallback>{mentee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{mentee.name}</p>
                    <p className="text-sm text-muted-foreground">{projects.find(p => p.id === `p${mentee.id}`)?.name || 'Unassigned'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
              </div>
            ))}
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
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award /> Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {mentor.skills.map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History /> Past Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {mentor.pastProjects.map(project => (
                <li key={project}>{project}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const projects = [
    {id: 'p1', name: 'AI-Powered Data Visualization'},
    {id: 'p2', name: 'Mobile-First E-commerce App'},
]
