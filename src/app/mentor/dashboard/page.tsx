
"use client";

import { useState } from "react";
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, Briefcase, Calendar, FileText, MessageSquare, Award, History, Upload, Save } from 'lucide-react';
import { mentors, students } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function MentorDashboardPage() {
  const { toast } = useToast();
  const mentor = mentors[0];
  const assignedProjects = students
    .filter(s => s.mentorId === mentor.id && s.projectId)
    .map(s => s.projectId)
    .filter((value, index, self) => self.indexOf(value) === index);
    
  const [schedulingLink, setSchedulingLink] = useState('https://calendly.com/your-meeting');
  const [reportFile, setReportFile] = useState<File | null>(null);


  const handleSaveLink = () => {
    toast({
      title: 'Link Saved',
      description: `The scheduling link has been updated.`,
    });
  };
  
  const handleSubmitReport = () => {
    if (!reportFile) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: `Please select a report file to submit.`,
      });
      return;
    }
     toast({
      title: 'Report Submitted',
      description: `Your report "${reportFile.name}" has been submitted for review.`,
    });
    setReportFile(null);
  };


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${mentor.id}`} data-ai-hint="person" />
          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{mentor.name}</h1>
          <p className="text-muted-foreground">Welcome to your Mentor Dashboard.</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="My Mentees" value={mentor.mentees.length} icon={Users} />
        <StatCard title="Active Projects" value={assignedProjects.length} icon={Briefcase} />
        <StatCard title="Upcoming Meetings" value="2" icon={Calendar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Mentees</CardTitle>
            <CardDescription>Your assigned students and their projects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mentor.mentees.map(mentee => {
              const project = students.find(p => p.id === mentee.id)?.projectId;
              const projectName = project ? `Project ${project.slice(1)}` : 'Unassigned';
              return (
                <div key={mentee.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                       <AvatarImage src={`https://i.pravatar.cc/150?u=${mentee.id}`} data-ai-hint="person" />
                      <AvatarFallback>{mentee.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{mentee.firstName} {mentee.lastName}</p>
                      <p className="text-sm text-muted-foreground">{projectName}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/students">
                <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2" />
                View All Students
                </Button>
            </Link>
            
            <Dialog>
              <DialogTrigger asChild>
                 <Button variant="outline" className="justify-start">
                  <Calendar className="mr-2" />
                  Schedule a Meeting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Scheduling Link</DialogTitle>
                  <DialogDescription>
                    Provide a link to your calendar (e.g., Calendly) for mentees to book meetings.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scheduling-link" className="text-right">
                      Link URL
                    </Label>
                    <Input
                      id="scheduling-link"
                      value={schedulingLink}
                      onChange={(e) => setSchedulingLink(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button onClick={handleSaveLink}>
                      <Save className="mr-2" />
                      Save Link
                    </Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2" />
                  Submit a Report
                </Button>
              </DialogTrigger>
               <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Project Report</DialogTitle>
                  <DialogDescription>
                    Upload your completed project report for administrative review.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                   <div className="grid gap-2">
                      <Label htmlFor="report-file">Report File</Label>
                      <Input
                        id="report-file"
                        type="file"
                        onChange={(e) => setReportFile(e.target.files ? e.target.files[0] : null)}
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                </div>
                <DialogFooter>
                   <DialogTrigger asChild>
                    <Button onClick={handleSubmitReport} disabled={!reportFile}>
                      <Upload className="mr-2" />
                      Submit Report
                    </Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
