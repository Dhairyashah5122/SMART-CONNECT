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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

export function SurveyList() {
  const [surveys, setSurveys] = useState(initialSurveys);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
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
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[200px]">Completion</TableHead>
              <TableHead className="w-[180px]">Last Reminder</TableHead>
              <TableHead className="w-[150px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => {
              const completionRate = Math.round((survey.responses / survey.totalParticipants) * 100);
              const isSending = sendingReminderId === survey.id;
              return (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
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
                <TableCell>{survey.lastReminderSent ? new Date(survey.lastReminderSent).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="text-right">
                    {survey.status === 'Active' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSendReminder(survey.id, survey.title)}
                        disabled={isSending}
                      >
                         {isSending ? (
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
