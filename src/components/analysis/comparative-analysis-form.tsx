"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { comparativeAnalysis, type ComparativeAnalysisOutput } from '@/ai/flows/comparative-analysis';
import { Loader2, Zap, CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '../ui/input';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export function ComparativeAnalysisForm() {
  const [projectCharter, setProjectCharter] = useState<File | null>(null);
  const [finalReport, setFinalReport] = useState<File | null>(null);
  const [safirnactionObjectives, setSafirnactionObjectives] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ComparativeAnalysisOutput | null>(null);

  const handleAnalyze = async () => {
    if (!projectCharter || !finalReport || !safirnactionObjectives) {
      alert('Please provide both files and the objectives.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const charterDataUri = await fileToDataURI(projectCharter);
      const reportDataUri = await fileToDataURI(finalReport);
      
      const analysisResult = await comparativeAnalysis({
        projectCharter: charterDataUri,
        finalReport: reportDataUri,
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
  
  const canAnalyze = projectCharter && finalReport && safirnactionObjectives;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Inputs</CardTitle>
          <CardDescription>Provide the necessary documents and information for the analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="project-charter">Project Charter</Label>
             <Input 
                id="project-charter" 
                type="file" 
                onChange={(e) => setProjectCharter(e.target.files?.[0] || null)} 
                accept=".pdf,.doc,.docx,.txt"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="final-report">Final Report</Label>
            <Input 
                id="final-report" 
                type="file" 
                onChange={(e) => setFinalReport(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.txt"
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
