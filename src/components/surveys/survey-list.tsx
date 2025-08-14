"use client";

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { surveys as initialSurveys } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { Progress } from '../ui/progress';
import { generateReminder } from '@/ai/flows/generate-reminder';
import { generateSurveyReport } from '@/ai/flows/generate-survey-report';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, FileText } from 'lucide-react';

export function SurveyList() {
  const [surveys, setSurveys] = useState(initialSurveys);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendReminder = async (surveyId: string, surveyTitle: string) => {
    setSendingReminderId(surveyId);
    try {
      const reminder = await generateReminder({ surveyTitle });
      console.log('Generated Reminder:', reminder);
      
      const updatedSurveys = surveys.map(s => 
        s.id === surveyId ? { ...s, lastReminderSent: new Date().toISOString().split('T')[0] } : s
      );
      setSurveys(updatedSurveys);

      toast({
        title: "Reminders Sent!",
        description: `Reminders have been sent for the "${surveyTitle}" survey.`,
      });

    } catch (error) {
      console.error("Failed to generate reminder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reminders. Please try again.",
      });
    } finally {
      setSendingReminderId(null);
    }
  };

  const handleGenerateReport = async (surveyId: string, surveyTitle: string) => {
    setGeneratingReportId(surveyId);
    try {
      // In a real app, you'd fetch the actual survey data here
      const dummySurveyData = "This is a sample of survey responses text data. Some users were happy, some were not. The key theme is communication.";
      const report = await generateSurveyReport({ surveyTitle, surveyData: dummySurveyData });
      
      toast({
        title: `Report for "${surveyTitle}"`,
        description: (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">AI-Generated Summary:</p>
            <p className="text-sm">{report.summary}</p>
          </div>
        ),
        duration: 9000,
      });

    } catch (error) {
      console.error("Failed to generate report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate report. Please try again.",
      });
    } finally {
      setGeneratingReportId(null);
    }
  };


  return (
    <Card>
       <CardHeader>
        <CardTitle>All Surveys</CardTitle>
        <CardDescription>A list of all surveys in the system, their status, and completion rate.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[200px]">Completion</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[180px]">Last Reminder</TableHead>
              <TableHead className="w-[280px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => {
              const completionRate = Math.round((survey.responses / survey.totalParticipants) * 100);
              const isSendingReminder = sendingReminderId === survey.id;
              const isGeneratingReport = generatingReportId === survey.id;
              return (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
                <TableCell>{survey.type}</TableCell>
                <TableCell>
                  <Badge variant={survey.status === 'Active' ? 'default' : 'secondary'}
                   className={survey.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                  >
                    {survey.status}
                  </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Progress value={completionRate} className="h-2" />
                        <span className="text-xs text-muted-foreground">{completionRate}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{survey.responses} / {survey.totalParticipants} responses</p>
                </TableCell>
                <TableCell>{new Date(survey.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{survey.lastReminderSent ? new Date(survey.lastReminderSent).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="text-right space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleGenerateReport(survey.id, survey.title)}
                      disabled={isGeneratingReport}
                    >
                       {isGeneratingReport ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      Report
                    </Button>
                    {survey.status === 'Active' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSendReminder(survey.id, survey.title)}
                        disabled={isSendingReminder}
                      >
                         {isSendingReminder ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        Remind
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
