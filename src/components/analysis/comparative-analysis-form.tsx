"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { comparativeAnalysis, type ComparativeAnalysisOutput } from '@/ai/flows/comparative-analysis';
import { Loader2, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ComparativeAnalysisForm() {
  const [projectScope, setProjectScope] = useState('');
  const [studentOutcomes, setStudentOutcomes] = useState('');
  const [safirnactionObjectives, setSafirnactionObjectives] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ComparativeAnalysisOutput | null>(null);

  const handleAnalyze = async () => {
    if (!projectScope || !studentOutcomes || !safirnactionObjectives) {
      alert('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await comparativeAnalysis({
        projectScope,
        studentOutcomes,
        safirnactionObjectives,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error('Error in comparative analysis:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const canAnalyze = projectScope && studentOutcomes && safirnactionObjectives;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Inputs</CardTitle>
          <CardDescription>Provide the necessary information for the analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="project-scope">Project Scope</Label>
            <Textarea
              id="project-scope"
              placeholder="Describe the project's goals, deliverables, and constraints..."
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="student-outcomes">Student Outcomes</Label>
            <Textarea
              id="student-outcomes"
              placeholder="Describe the expected skills, knowledge, and experience students will gain..."
              value={studentOutcomes}
              onChange={(e) => setStudentOutcomes(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="safirnaction-objectives">Safirnaction Objectives</Label>
            <Textarea
              id="safirnaction-objectives"
              placeholder="Describe the strategic goals of Safirnaction relevant to this project..."
              value={safirnactionObjectives}
              onChange={(e) => setSafirnactionObjectives(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={!canAnalyze || isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center rounded-lg border h-full bg-card">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {!isLoading && !result && (
          <div className="flex items-center justify-center rounded-lg border h-full bg-card text-center text-muted-foreground p-8">
            <p>Analysis results will appear here.</p>
          </div>
        )}
        {result && (
            <div className='space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{result.analysis}</p>
                    </CardContent>
                </Card>
                <Alert className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50'>
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className='text-green-800 dark:text-green-300'>Identified Alignments</AlertTitle>
                    <AlertDescription className='text-green-700 dark:text-green-400/80'>
                        {result.alignments}
                    </AlertDescription>
                </Alert>
                <Alert variant="destructive" className='border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200 dark:[&>svg]:text-amber-400'>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Identified Gaps</AlertTitle>
                    <AlertDescription>
                        {result.gaps}
                    </AlertDescription>
                </Alert>
            </div>
        )}
      </div>
    </div>
  );
}
