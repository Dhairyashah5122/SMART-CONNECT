
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { analyzeSurveyData, type AnalyzeSurveyDataOutput } from '@/ai/flows/analyze-survey-data';
import { Loader2, Zap, BarChart, BrainCircuit, Smile, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SurveyDataAnalysisForm() {
  const [surveyData, setSurveyData] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [safirnactionObjectives, setSafirnactionObjectives] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeSurveyDataOutput | null>(null);

  const handleAnalyze = async () => {
    if (!surveyData || !projectScope || !safirnactionObjectives) {
      alert('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzeSurveyData({
        surveyData,
        projectScope,
        safirnactionObjectives,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error('Error in survey data analysis:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const canAnalyze = surveyData && projectScope && safirnactionObjectives;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Survey Analysis Inputs</CardTitle>
          <CardDescription>Provide the raw survey text and contextual information for the AI to analyze.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="survey-data">Raw Survey Data</Label>
            <Textarea
              id="survey-data"
              placeholder="Paste the full text of all survey responses here..."
              value={surveyData}
              onChange={(e) => setSurveyData(e.target.value)}
              rows={8}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-scope">Project Scope</Label>
            <Textarea
              id="project-scope"
              placeholder="Describe the project scope that is relevant to this survey..."
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="organizational-objectives">Organizational Objectives</Label>
            <Textarea
              id="organizational-objectives"
              placeholder="Describe the strategic goals of the organization relevant to this project..."
              value={safirnactionObjectives}
              onChange={(e) => setSafirnactionObjectives(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={!canAnalyze || isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Analyze Survey Data
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
            <p>Survey analysis results will appear here.</p>
          </div>
        )}
        {result && (
            <div className='space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart /> Key Trends & Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{result.keyTrends}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BrainCircuit /> Thematic Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{result.thematicAnalysis}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Smile /> Sentiment Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{result.sentimentAnalysis}</p>
                    </CardContent>
                </Card>
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Project Alignment Analysis</AlertTitle>
                    <AlertDescription>
                        {result.projectAlignment}
                    </AlertDescription>
                </Alert>
            </div>
        )}
      </div>
    </div>
  );
}
