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
import { generateNdaReminder } from "@/ai/flows/generate-nda-reminder"
import { Loader2, Send } from "lucide-react"

export function StudentTable() {
  const [students, setStudents] = useState(initialStudents);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendNdaReminder = async (studentId: string, studentName: string, projectName: string) => {
    setSendingReminderId(studentId);
    try {
      const reminder = await generateNdaReminder({ studentName, projectName });
      console.log("Generated NDA Reminder:", reminder);

      toast({
        title: "Reminder Sent!",
        description: `NDA reminder has been sent to ${studentName}.`,
      });

    } catch (error) {
       console.error("Failed to generate NDA reminder:", error);
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Matched Project</TableHead>
              <TableHead>Assigned Mentor</TableHead>
              <TableHead>NDA Status</TableHead>
              <TableHead>Survey Completion</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.filter(s => s.status === 'Approved').map((student) => {
              const project = projects.find(p => p.id === student.projectId);
              const mentor = mentors.find(m => m.id === student.mentorId);
              const studentName = student.fullName || `${student.firstName} ${student.lastName}`;
              const isSending = sendingReminderId === student.id;

              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${student.id}`} data-ai-hint="person" />
                      <AvatarFallback>{studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{studentName}</TableCell>
                  <TableCell>{project?.name || 'N/A'}</TableCell>
                  <TableCell>{mentor?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge 
                        variant={student.ndaStatus === 'Signed' ? 'default' : 'secondary'}
                        className={
                            student.ndaStatus === 'Signed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                        }
                    >
                      {student.ndaStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.postCapstoneSurveyStatus ? (
                       <Badge 
                        variant={student.postCapstoneSurveyStatus === 'Completed' ? 'default' : student.postCapstoneSurveyStatus === 'Pending' ? 'secondary' : 'outline'}
                        className={
                            student.postCapstoneSurveyStatus === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                            : student.postCapstoneSurveyStatus === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                            : ''
                        }
                    >
                      {student.postCapstoneSurveyStatus}
                    </Badge>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {student.ndaStatus === 'Pending' && project && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendNdaReminder(student.id, studentName, project.name)}
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
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
