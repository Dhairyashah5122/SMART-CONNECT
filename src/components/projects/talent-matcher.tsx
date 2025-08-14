 "use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { students as initialStudents, projects, mentors } from '@/lib/data';
import { recommendStudentForProject, type RecommendStudentOutput } from '@/ai/flows/recommend-student-for-project';
import { matchStudentsToProjects, type MatchStudentsToProjectsOutput } from '@/ai/flows/match-students-to-projects';
import { Loader2, Sparkles, Wand2, CheckCircle, User, Users } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/lib/types';
import { Separator } from '../ui/separator';


type MatcherResult = (RecommendStudentOutput | MatchStudentsToProjectsOutput) & {
    student?: Student;
}

export function TalentMatcher() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatcherResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) {
      alert('Please select a project.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
        if (selectedStudentId && selectedStudentId !== 'recommend') {
            // Specific student-project analysis
            const student = students.find(s => s.id === selectedStudentId);
            if (!student) {
                alert('Selected student not found.');
                setIsLoading(false);
                return;
            }
             const matchResult = await matchStudentsToProjects({
                projectDescription: project.description,
                studentResume: student.resume,
            });
            setResult({ ...matchResult, student: student });

        } else {
            // Project-based recommendation
            const availableStudents = students
                .filter(s => !s.projectId)
                .map(s => ({
                    id: s.id,
                    name: s.fullName,
                    resume: s.resume,
                }));
            
            if (availableStudents.length === 0) {
                toast({
                    variant: 'destructive',
                    title: 'No Available Students',
                    description: 'All students are currently assigned to projects.',
                });
                setIsLoading(false);
                return;
            }

            const recommendation = await recommendStudentForProject({
                projectDescription: project.description,
                students: availableStudents,
            });

            const recommendedStudent = students.find(s => s.id === recommendation.studentId);
            setResult({ ...recommendation, student: recommendedStudent });
        }

    } catch (error) {
      console.error('Error in AI analysis:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveMatch = () => {
    if (!result?.student || !selectedProjectId) {
        alert("Something went wrong. Please try again.");
        return;
    }
    
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;
    
    const projectMentor = mentors[0]; // Assuming one mentor for now as in data

    setStudents(prevStudents => 
        prevStudents.map(s => 
            s.id === result.student!.id 
                ? { ...s, projectId: selectedProjectId, mentorId: projectMentor.id, status: 'Approved' } 
                : s
        )
    );

    toast({
        title: "Match Approved!",
        description: `${result.student.fullName} has been assigned to "${project.name}" with ${projectMentor.name} as mentor.`,
    });

    setResult(null);
    setSelectedProjectId('');
    setSelectedStudentId('');
  };
  
  const canAnalyze = selectedProjectId;
  const analysisMode = (selectedStudentId && selectedStudentId !== 'recommend') ? "Analyze Match" : "Find Best Match";
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Talent Matching AI</CardTitle>
          <CardDescription>Select a project to get an AI recommendation, or select both a project and a student to analyze a specific match.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
           <div className="space-y-4">
             <div className="grid gap-2">
                <Label htmlFor="project">1. Select a Project</Label>
                <Select onValueChange={setSelectedProjectId} value={selectedProjectId}>
                <SelectTrigger id="project">
                    <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                    {projects.filter(p => p.status !== 'Completed').map(project => (
                        <SelectItem key={project.id} value={project.id} disabled={students.some(s => s.projectId === project.id)}>
                            {project.name} {students.some(s => s.projectId === project.id) ? '(Assigned)' : ''}
                        </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">Only projects that are not completed or assigned are shown.</p>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="student">2. Select a Student (Optional)</Label>
                <Select onValueChange={setSelectedStudentId} value={selectedStudentId} disabled={!selectedProjectId}>
                <SelectTrigger id="student">
                    <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                     <SelectItem value="recommend">None (Recommend for me)</SelectItem>
                    {students.filter(s => !s.projectId).map(student => (
                        <SelectItem key={student.id} value={student.id}>
                            {student.fullName}
                        </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">Only unassigned students are shown.</p>
            </div>
            
             <Button onClick={handleAnalyze} disabled={!canAnalyze || isLoading} className="w-full">
                {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    analysisMode === 'Analyze Match' ? <Users className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />
                )}
                {analysisMode}
            </Button>

            {selectedProject && (
                <div className='space-y-2 mt-4'>
                    <Label>Project Description</Label>
                    <p className='text-sm text-muted-foreground p-3 bg-secondary/30 border rounded-lg h-40 overflow-y-auto'>
                        {selectedProject.description}
                    </p>
                </div>
            )}
           </div>
            <Card className="flex flex-col bg-muted/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="text-primary" /> AI Result
                    </CardTitle>
                    <CardDescription>The match analysis or recommendation will appear here.</CardDescription>
                </CardHeader>
                 <CardContent className="flex-grow flex flex-col justify-center">
                    {isLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                    {!isLoading && !result && (
                        <div className="text-center text-muted-foreground p-4">
                            <p>Select a project and click "{analysisMode}".</p>
                        </div>
                    )}
                    {result && result.student && (
                         <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${result.student.id}`} data-ai-hint="person" />
                                <AvatarFallback>{result.student.firstName.charAt(0)}{result.student.lastName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                <h3 className="text-xl font-semibold">{result.student.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{result.student.emailAddress}</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold">Match Score</h3>
                                    <span className="font-bold text-primary text-lg">{result.matchScore}%</span>
                                </div>
                                <Progress value={result.matchScore} className="h-2" />
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                {result.student.skills.map(skill => (
                                    <Badge key={skill}>{skill}</Badge>
                                ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/> AI Justification</CardTitle>
          <CardDescription>An explanation of why the AI recommended this student.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
           {!isLoading && !result && (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                <p>Analysis results will be displayed here.</p>
            </div>
          )}
          {result && (
             <div className="space-y-4 h-full flex flex-col">
                <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border flex-grow">{result.justification}</p>
                <Button onClick={handleApproveMatch} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={students.some(s => s.projectId === selectedProjectId)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Match & Assign
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
