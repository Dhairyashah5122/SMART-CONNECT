 "use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { students as initialStudents, projects, mentors } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { generateMilestoneReminder } from "@/ai/flows/generate-milestone-reminder"
import { Loader2, Send, AlertTriangle } from "lucide-react"
import { Progress } from "../ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function StudentTable() {
  const [students, setStudents] = useState(initialStudents);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendReminder = async (studentId: string, studentName: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !student.milestones) return;
    
    setSendingReminderId(studentId);
    try {
        const incompleteMilestones = student.milestones
            .filter(m => m.status === 'pending')
            .map(m => m.text);

      const reminder = await generateMilestoneReminder({ 
          studentName, 
          incompleteMilestones 
      });

      console.log("Generated Milestone Reminder:", reminder);

      toast({
        title: "Reminder Sent!",
        description: `A milestone reminder has been sent to ${studentName}.`,
      });

    } catch (error) {
       console.error("Failed to generate milestone reminder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reminder. Please try again.",
      });
    } finally {
      setSendingReminderId(null);
    }
  }


  return (
    <Card>
       <CardHeader>
        <CardTitle>Approved Students</CardTitle>
        <CardDescription>A list of all students approved for the Smaty Capstone project.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Matched Project</TableHead>
              <TableHead>Assigned Mentor</TableHead>
              <TableHead>Project Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.filter(s => s.status === 'Approved').map((student) => {
              const project = projects.find(p => p.id === student.projectId);
              const mentor = mentors.find(m => m.id === student.mentorId);
              const studentName = student.fullName || `${student.firstName} ${student.lastName}`;
              const isSending = sendingReminderId === student.id;

              const completedMilestones = student.milestones?.filter(m => m.status === 'completed').length || 0;
              const totalMilestones = student.milestones?.length || 0;
              const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
              
              const overdueMilestones = student.milestones?.filter(m => m.status === 'pending' && new Date(m.dueDate) < new Date()).length || 0;

              return (
                <TableRow key={student.id}>
                   <TableCell className="font-medium">
                     <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${student.id}`} data-ai-hint="person" />
                          <AvatarFallback>{studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {studentName}
                     </div>
                  </TableCell>
                  <TableCell>{project?.name || 'N/A'}</TableCell>
                  <TableCell>{mentor?.name || 'N/A'}</TableCell>
                  <TableCell>
                     {totalMilestones > 0 ? (
                        <div className="flex items-center gap-2">
                           <Progress value={progress} className="h-2 w-24" />
                           <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                        </div>
                     ) : (
                        <Badge variant="outline">Not Started</Badge>
                     )}
                  </TableCell>
                  <TableCell className="text-right">
                    {overdueMilestones > 0 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                 <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleSendReminder(student.id, studentName)}
                                    disabled={isSending}
                                >
                                    {isSending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    )}
                                    Remind
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{overdueMilestones} milestone(s) overdue. Click to send a reminder.</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                     {student.ndaStatus === 'Pending' && !overdueMilestones && project && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendReminder(student.id, studentName)}
                        disabled={isSending}
                      >
                         {isSending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        NDA Reminder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
