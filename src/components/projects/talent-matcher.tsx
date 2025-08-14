 "use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { students, projects } from '@/lib/data';
import { matchStudentsToProjects, type MatchStudentsToProjectsOutput } from '@/ai/flows/match-students-to-projects';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

export function TalentMatcher() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchStudentsToProjectsOutput | null>(null);

  const handleMatch = async () => {
    const student = students.find(s => s.id === selectedStudentId);
    const project = projects.find(p => p.id === selectedProjectId);

    if (!student || !project) {
      alert('Please select a student and a project.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const matchResult = await matchStudentsToProjects({
        studentResume: student.resume,
        projectDescription: project.description,
      });
      setResult(matchResult);
    } catch (error) {
      console.error('Error matching students to projects:', error);
      alert('An error occurred while matching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const canMatch = selectedStudentId && selectedProjectId;
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Select Candidates</CardTitle>
          <CardDescription>Choose a student and a project to evaluate their compatibility.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
           <div className="space-y-4">
                <Label>1. Select a Student</Label>
                <RadioGroup value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <ScrollArea className="h-72 w-full rounded-md border p-4">
                    {students.map(student => (
                        <Label
                            key={student.id}
                            htmlFor={student.id}
                            className="flex items-start gap-4 rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:bg-accent"
                        >
                             <Avatar className="h-9 w-9">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${student.id}`} data-ai-hint="person" />
                                <AvatarFallback>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='flex-grow'>
                                <div className="font-semibold">{student.firstName} {student.lastName}</div>
                                 <div className="flex flex-wrap gap-1 mt-1">
                                    {student.skills.slice(0, 3).map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                            <RadioGroupItem value={student.id} id={student.id} className="mt-2" />
                        </Label>
                    ))}
                    </ScrollArea>
                </RadioGroup>
           </div>
           <div className="space-y-4">
             <div className="grid gap-2">
                <Label htmlFor="project">2. Select a Project</Label>
                <Select onValueChange={setSelectedProjectId} value={selectedProjectId}>
                <SelectTrigger id="project">
                    <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                    {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-accent" /> Match Analysis
                    </CardTitle>
                    <CardDescription>AI-powered analysis of the student-project fit.</CardDescription>
                </CardHeader>
                 <CardContent className="flex-grow flex items-center justify-center">
                    {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                    {!isLoading && !result && (
                        <div className="text-center text-muted-foreground p-4">
                        <p>Results will be displayed here.</p>
                        </div>
                    )}
                    {result && (
                        <div className="w-full space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                            <h3 className="font-semibold">Match Score</h3>
                            <span className="font-bold text-primary text-lg">{result.matchScore}%</span>
                            </div>
                            <Progress value={result.matchScore} className="h-2" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Justification</h3>
                            <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md border h-32 overflow-y-auto">{result.justification}</p>
                        </div>
                        </div>
                    )}
                    </CardContent>
            </Card>
           </div>
        </CardContent>
        <CardFooter className='border-t pt-6'>
          <Button onClick={handleMatch} disabled={!canMatch || isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {selectedStudent ? `Match ${selectedStudent.firstName} to Project` : 'Find Match'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Selected Student Details</CardTitle>
          <CardDescription>A brief overview of the selected candidate.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {selectedStudent ? (
             <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedStudent.id}`} data-ai-hint="person" />
                  <AvatarFallback>{selectedStudent.firstName.charAt(0)}{selectedStudent.lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.emailAddress}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map(skill => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
               <div>
                <h4 className="font-semibold mb-2">Resume Summary</h4>
                <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border h-48 overflow-y-auto">{selectedStudent.resume}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>Select a student to see their details.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    