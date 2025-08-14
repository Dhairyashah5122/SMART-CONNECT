
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { analyzeSurveyData, type AnalyzeSurveyDataOutput } from '@/ai/flows/analyze-survey-data';
import { Loader2, Zap, BarChart, BrainCircuit, Smile, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const MOCK_SURVEY_DATA = `Response 1: The project was a fantastic learning experience. The client communication was excellent, though the initial project scope was a bit ambiguous. I feel much more confident in my React skills.
Response 2: I found the project very challenging. The deadlines were tight, but my mentor was incredibly supportive. Better team collaboration tools would have been helpful. Overall, a positive experience.
Response 3: The scope was clear and the objectives were met. I wish we had more direct feedback from the company stakeholders during the development process. The final outcome was successful.
Response 4: A mixed bag. While the technical skills I gained are invaluable, the team dynamics were difficult to navigate. I'm happy with the final product we delivered.`;

const MOCK_PROJECT_SCOPE = "Develop an interactive platform that uses AI to automatically generate insightful visualizations from raw data sets. Requires skills in data analysis, machine learning, and front-end development (React).";

const MOCK_OBJECTIVES = `1. Enhance student practical skills in AI/ML.
2. Foster industry partnerships for future collaborations.
3. Ensure 85% of projects meet or exceed client expectations.`;

const MOCK_INITIAL_RESULT: AnalyzeSurveyDataOutput = {
    keyTrends: "The primary trend is positive skill acquisition, with students frequently mentioning gains in technical abilities (React) and soft skills (communication). A secondary trend indicates a need for improved project management, particularly around team dynamics and feedback channels.",
    thematicAnalysis: "Three key themes emerge: 1) Technical Skill Development (React, data analysis), 2) Project Support Systems (mentorship is a positive, team tools need improvement), and 3) Stakeholder Communication (desire for more direct client feedback).",
    sentimentAnalysis: "The overall sentiment is Positive. Despite challenges mentioned, most responses use positive language ('fantastic', 'successful', 'invaluable') and express satisfaction with the learning outcomes and final product.",
    projectAlignment: "The analysis shows a strong alignment between student outcomes and Safirnaction's objectives. Students are gaining practical AI/ML-adjacent skills (React, data analysis). However, the identified communication and collaboration gaps suggest a potential misalignment with the objective of fostering deep industry partnerships, which could be strengthened by more structured interaction."
};

export function SurveyDataAnalysisForm() {
  const [surveyData, setSurveyData] = useState(MOCK_SURVEY_DATA);
  const [projectScope, setProjectScope] = useState(MOCK_PROJECT_SCOPE);
  const [safirnactionObjectives, setSafirnactionObjectives] = useState(MOCK_OBJECTIVES);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeSurveyDataOutput | null>(MOCK_INITIAL_RESULT);

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
    <div className="space-y-6">
        <CardHeader className="p-0">
            <CardTitle>Survey Text Analysis</CardTitle>
            <CardDescription>Paste raw survey text, provide project context, and the AI will perform thematic, sentiment, and alignment analysis.</CardDescription>
        </CardHeader>
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Analysis Inputs</CardTitle>
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
    </div>
  );
}
