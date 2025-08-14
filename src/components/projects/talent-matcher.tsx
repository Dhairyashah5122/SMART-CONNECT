 "use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { students as initialStudents, projects, mentors } from '@/lib/data';
import { rankStudentsForProject, type RankStudentsForProjectOutput } from '@/ai/flows/rank-students-for-project';
import { Loader2, Wand2, CheckCircle, PlusCircle, XCircle, Users, ArrowRight } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

type RankedStudent = (RankStudentsForProjectOutput['rankedStudents'][number]) & { student: Student };

const unassignedApprovedStudents = initialStudents.filter(s => !s.projectId && s.status === 'Approved');

const MOCK_INITIAL_RANKING: RankedStudent[] = unassignedApprovedStudents.map(student => {
    let score = 75;
    let justification = "Strong foundational skills and a clear interest in the project domain.";
    if (student.skills.includes('Cybersecurity')) {
        score = 95;
        justification = "Excellent alignment of skills with project needs, particularly in cybersecurity and Python.";
    } else if (student.skills.includes('Java')) {
        score = 82;
        justification = "Solid software engineering background with relevant skills in Java and cloud platforms.";
    }
    return {
        studentId: student.id,
        matchScore: score,
        justification: justification,
        student: student,
    }
}).sort((a, b) => b.matchScore - a.matchScore);


export function TalentMatcher() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects.find(p => p.status === 'Not Assigned')?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [rankedStudents, setRankedStudents] = useState<RankedStudent[]>(MOCK_INITIAL_RANKING);
  const [proposedTeam, setProposedTeam] = useState<RankedStudent[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) {
      toast({ variant: "destructive", title: "Please select a project." });
      return;
    }

    setIsLoading(true);
    setRankedStudents([]);
    setProposedTeam([]);

    try {
        const availableStudents = students
            .filter(s => !s.projectId && s.status === 'Approved')
            .map(s => ({
                id: s.id,
                name: s.fullName,
                resume: s.resume,
            }));
        
        if (availableStudents.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Available Students',
                description: 'All approved students are currently assigned to projects.',
            });
            setIsLoading(false);
            return;
        }

        const result = await rankStudentsForProject({
            projectDescription: project.description,
            students: availableStudents,
        });

        const studentMap = new Map(students.map(s => [s.id, s]));
        const enrichedAndRanked = result.rankedStudents.map(rs => ({
            ...rs,
            student: studentMap.get(rs.studentId)!,
        })).filter(rs => rs.student);
        
        setRankedStudents(enrichedAndRanked);

    } catch (error) {
      console.error('Error in AI analysis:', error);
      toast({ variant: "destructive", title: "Analysis Failed", description: "An error occurred during analysis. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToTeam = (student: RankedStudent) => {
    if (!proposedTeam.some(s => s.studentId === student.studentId)) {
        setProposedTeam(prev => [...prev, student]);
    }
  };

  const handleRemoveFromTeam = (studentId: string) => {
    setProposedTeam(prev => prev.filter(s => s.studentId !== studentId));
  };
  
  const handleFinalizeTeam = () => {
    if (proposedTeam.length === 0 || !selectedProjectId) {
      toast({ variant: "destructive", title: "Cannot Finalize", description: "Please add students to the proposed team." });
      return;
    }
    
    const project = projects.find(p => p.id === selectedProjectId);
    const mentor = mentors[0]; // Simple assignment for now

    setStudents(prevStudents => 
      prevStudents.map(s => {
        if (proposedTeam.some(p => p.studentId === s.id)) {
          return { ...s, projectId: selectedProjectId, mentorId: mentor.id, status: "Approved" };
        }
        return s;
      })
    );
    
    toast({
      title: "Team Finalized!",
      description: `${proposedTeam.length} students have been assigned to "${project?.name}".`,
    });

    setRankedStudents([]);
    setProposedTeam([]);
    setSelectedProjectId("");
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const availableRankedStudents = rankedStudents.filter(rs => !proposedTeam.some(p => p.studentId === rs.studentId));


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>AI-Powered Team Builder</CardTitle>
          <CardDescription>Select a project to rank available students and build the perfect team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 space-y-4 sm:space-y-0">
                <div className="grid gap-2 flex-1">
                    <Label htmlFor="project">1. Select a Project</Label>
                    <Select onValueChange={setSelectedProjectId} value={selectedProjectId}>
                        <SelectTrigger id="project">
                            <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.filter(p => p.status === 'Not Assigned').map(project => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <p className="text-xs text-muted-foreground">Only unassigned projects are shown.</p>
                </div>
                 <Button onClick={handleAnalyze} disabled={!selectedProjectId || isLoading} className="w-full sm:w-auto">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Rank Students
                </Button>
            </div>
             {selectedProject && (
                <div className='space-y-2 mt-4'>
                    <Label>Project Description</Label>
                    <p className='text-sm text-muted-foreground p-3 bg-secondary/30 border rounded-lg h-24 overflow-y-auto'>
                        {selectedProject.description}
                    </p>
                </div>
            )}
        </CardContent>
      </Card>
      
        {isLoading ? (
            <div className="lg:col-span-3 flex items-center justify-center rounded-lg border h-64 bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : rankedStudents.length > 0 && (
            <>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Available Students</CardTitle>
                        <CardDescription>AI-ranked list of approved, unassigned students. Click to add them to the team.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <div className="space-y-4 pr-4">
                                {availableRankedStudents.map(rs => (
                                    <Card key={rs.studentId} className="flex items-center p-3 gap-3 hover:bg-muted/50 transition-colors">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${rs.student.id}`} data-ai-hint="person" />
                                            <AvatarFallback>{rs.student.firstName.charAt(0)}{rs.student.lastName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <p className="font-semibold">{rs.student.fullName}</p>
                                            <div className='flex justify-between items-center'>
                                                <Label>Match Score</Label>
                                                <span className="font-bold text-primary">{rs.matchScore}%</span>
                                            </div>
                                            <Progress value={rs.matchScore} className="h-1.5"/>
                                            <p className="text-xs text-muted-foreground pt-1 italic">"{rs.justification}"</p>
                                        </div>
                                         <Button size="icon" variant="ghost" onClick={() => handleAddToTeam(rs)}>
                                            <PlusCircle className="text-green-600" />
                                        </Button>
                                    </Card>
                                ))}
                                {availableRankedStudents.length === 0 && <p className="text-sm text-muted-foreground text-center pt-8">All ranked students have been added to the team.</p>}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Users /> Proposed Team</CardTitle>
                        <CardDescription>Students to be assigned to "{selectedProject?.name}".</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <div className="space-y-2 pr-2">
                                {proposedTeam.map(rs => (
                                    <div key={rs.studentId} className="flex items-center gap-2 p-2 rounded-md border bg-background">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${rs.student.id}`} data-ai-hint="person" />
                                            <AvatarFallback>{rs.student.firstName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="flex-1 text-sm font-medium truncate">{rs.student.fullName}</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveFromTeam(rs.studentId)}>
                                            <XCircle className="text-destructive"/>
                                        </Button>
                                    </div>
                                ))}
                                {proposedTeam.length === 0 && <p className="text-sm text-muted-foreground text-center pt-8">Add students from the list on the left.</p>}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleFinalizeTeam} className="w-full" disabled={proposedTeam.length === 0}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Finalize & Assign Team
                        </Button>
                    </CardFooter>
                </Card>
            </>
        )}
    </div>
  );
}
