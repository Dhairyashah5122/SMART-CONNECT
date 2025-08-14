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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Select Candidates</CardTitle>
          <CardDescription>Choose a student and a project to evaluate their compatibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="student">Student</Label>
            <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
              <SelectTrigger id="student">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project">Project</Label>
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleMatch} disabled={!canMatch || isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Find Match
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-accent" /> Match Analysis
          </CardTitle>
          <CardDescription>AI-powered analysis of the student-project fit.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {!isLoading && !result && (
            <div className="text-center text-muted-foreground">
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
                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md border">{result.justification}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
