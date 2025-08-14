
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { comparativeAnalysis, type ComparativeAnalysisOutput } from '@/ai/flows/comparative-analysis';
import { Loader2, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
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

const MOCK_OBJECTIVES = `1. Enhance student practical skills in AI/ML.
2. Foster industry partnerships for future collaborations.
3. Ensure 85% of projects meet or exceed client expectations.
4. Improve the real-world problem-solving abilities of students.`;

const MOCK_INITIAL_RESULT: ComparativeAnalysisOutput = {
    analysis: "The project successfully met its core objective of developing an AI-powered visualization platform. Student outcomes, as detailed in the final report, show a significant improvement in practical React and data analysis skills, directly aligning with organizational objectives. The final deliverable exceeded the initial scope outlined in the charter by incorporating an advanced machine learning model not originally planned.",
    gaps: "A notable gap exists in stakeholder communication. The final report indicates that while the development team communicated well internally, client feedback loops were not as frequent as desired. This represents a procedural gap that could be addressed in future projects to better align with the organizational goal of fostering strong industry partnerships.",
    alignments: "There is a strong alignment between the skills gained by the students (React, Node.js, Data Analysis) and the organizational objective to enhance practical, in-demand skills. The project's successful completion and positive client feedback (despite communication gaps) align with the goal of ensuring high project success rates."
};

export function ComparativeAnalysisForm() {
  const [projectCharter, setProjectCharter] = useState<File | null>(null);
  const [finalReport, setFinalReport] = useState<File | null>(null);
  const [organizationalObjectives, setOrganizationalObjectives] = useState(MOCK_OBJECTIVES);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ComparativeAnalysisOutput | null>(MOCK_INITIAL_RESULT);

  const handleAnalyze = async () => {
    if (!projectCharter || !finalReport || !organizationalObjectives) {
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
        organizationalObjectives,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error('Error in comparative analysis:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const canAnalyze = projectCharter && finalReport && organizationalObjectives;

  return (
    <div className="space-y-6">
        <CardHeader className="p-0">
            <CardTitle>Document-Based Comparative Analysis</CardTitle>
            <CardDescription>Upload a Project Charter and a Final Report, describe the organizational objectives, and the AI will identify gaps and alignments.</CardDescription>
        </CardHeader>
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Analysis Inputs</CardTitle>
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
                     <p className="text-xs text-muted-foreground">Defines the project scope and initial goals.</p>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="final-report">Final Report</Label>
                    <Input 
                        id="final-report" 
                        type="file" 
                        onChange={(e) => setFinalReport(e.target.files?.[0] || null)}
                        accept=".pdf,.doc,.docx,.txt"
                    />
                     <p className="text-xs text-muted-foreground">Details the student outcomes and final deliverables.</p>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="organizational-objectives">Organizational Objectives</Label>
                    <Textarea
                    id="organizational-objectives"
                    placeholder="Describe the strategic goals of the organization relevant to this project..."
                    value={organizationalObjectives}
                    onChange={(e) => setOrganizationalObjectives(e.target.value)}
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
                    Analyze Documents
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
                    <p>Document analysis results will appear here.</p>
                </div>
                )}
                {result && (
                    <div className='space-y-4'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Overall Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={result.analysis}
                                    onChange={(e) => setResult(prev => prev ? {...prev, analysis: e.target.value} : null)}
                                    className="w-full h-full flex-1 p-2 border rounded-lg bg-secondary/30 min-h-[120px]"
                                />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300"><CheckCircle /> Identified Alignments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <Textarea
                                    value={result.alignments}
                                    onChange={(e) => setResult(prev => prev ? {...prev, alignments: e.target.value} : null)}
                                    className="w-full h-full flex-1 p-2 border rounded-lg bg-green-50 dark:bg-green-950/50 min-h-[120px]"
                                />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-200"><AlertTriangle /> Identified Gaps</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <Textarea
                                    value={result.gaps}
                                    onChange={(e) => setResult(prev => prev ? {...prev, gaps: e.target.value} : null)}
                                    className="w-full h-full flex-1 p-2 border rounded-lg bg-amber-50 dark:bg-amber-950/50 min-h-[120px]"
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
