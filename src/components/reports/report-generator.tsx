"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Zap, Star, FileText } from 'lucide-react';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { generateSuccessStory } from '@/ai/flows/generate-success-story';
import { generateCaseStudy } from '@/ai/flows/generate-case-study';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export function ReportGenerator() {
  const [projectReport, setProjectReport] = useState<File | null>(null);
  const [reportType, setReportType] = useState<'success-story' | 'case-study'>('success-story');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!projectReport) {
      toast({
          variant: 'destructive',
          title: 'Missing File',
          description: 'Please upload a project report to generate a document.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const reportDataUri = await fileToDataURI(projectReport);
      
      let analysisResult;
      if (reportType === 'success-story') {
        analysisResult = await generateSuccessStory({ projectReport: reportDataUri });
        setResult(analysisResult.successStory);
      } else {
        analysisResult = await generateCaseStudy({ projectReport: reportDataUri });
        setResult(analysisResult.caseStudy);
      }

    } catch (error) {
      console.error('Error in report generation:', error);
      toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'An error occurred during report generation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const canGenerate = projectReport;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generator Inputs</CardTitle>
          <CardDescription>Upload a project report and select the type of document you want to generate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="project-report">Project Report</Label>
             <Input 
                id="project-report" 
                type="file" 
                onChange={(e) => setProjectReport(e.target.files?.[0] || null)} 
                accept=".pdf,.doc,.docx,.txt"
            />
             <p className="text-xs text-muted-foreground">Upload the final project report from a mentor.</p>
          </div>

          <RadioGroup value={reportType} onValueChange={(value) => setReportType(value as any)} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="success-story" id="r1" className="peer sr-only" />
                <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Star className="mb-3 h-6 w-6" />
                    Success Story
                </Label>
              </div>
              <div>
                <RadioGroupItem value="case-study" id="r2" className="peer sr-only" />
                <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <FileText className="mb-3 h-6 w-6" />
                    Case Study
                </Label>
              </div>
          </RadioGroup>

        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={!canGenerate || isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Generate
          </Button>
        </CardFooter>
      </Card>
      
      <Card className='flex flex-col'>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>The AI-generated content will appear below. You can copy and paste it into any document.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {isLoading && (
            <div className="flex items-center justify-center rounded-lg border h-full bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            )}
            {!isLoading && !result && (
            <div className="flex items-center justify-center rounded-lg border h-full bg-card text-center text-muted-foreground p-8">
                <p>Generated content will appear here.</p>
            </div>
            )}
            {result && (
                <ScrollArea className='h-full'>
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-secondary/30 whitespace-pre-wrap">
                        {result}
                    </div>
                </ScrollArea>
            )}
          </CardContent>
      </Card>
    </div>
  );
}
