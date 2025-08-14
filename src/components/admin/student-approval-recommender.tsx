
"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, Sparkles, User, BadgeIndianRupee, Star } from "lucide-react";
import { students as initialStudents } from "@/lib/data";
import type { Student } from "@/lib/types";
import {
  rankStudentsForProgram,
  type RankStudentsForProgramOutput,
} from "@/ai/flows/rank-students-for-program";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";

type RankedStudent = RankStudentsForProgramOutput["rankedStudents"][number] & {
  student: Student;
};

export function StudentApprovalRecommender() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rankedStudents, setRankedStudents] = useState<RankedStudent[] | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setRankedStudents(null);
    try {
      const pendingStudents = students
        .filter((s) => s.status === "Pending")
        .map((s) => ({
          id: s.id,
          name: s.fullName,
          resume: s.resume,
          gpa: s.currentGpa || 0,
          skills: s.skills,
        }));

      if (pendingStudents.length === 0) {
        toast({
          title: "No Pending Students",
          description: "There are no students awaiting approval.",
        });
        return;
      }

      const result = await rankStudentsForProgram({ students: pendingStudents });
      
      const studentMap = new Map(students.map((s) => [s.id, s]));
      const enrichedAndRanked = result.rankedStudents.map((rs) => ({
        ...rs,
        student: studentMap.get(rs.studentId)!,
      })).filter(rs => rs.student);


      setRankedStudents(enrichedAndRanked);
      toast({
        title: "Analysis Complete",
        description: "Students have been ranked by the AI.",
      });
    } catch (error) {
      console.error("Error analyzing students:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze students. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApproveStudent = (studentId: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, status: "Approved" } : student
      )
    );
     setRankedStudents(prevRanked => prevRanked?.filter(rs => rs.studentId !== studentId) || null);

    const student = students.find((s) => s.id === studentId);
    if (student) {
      toast({
        title: "Student Approved",
        description: `${student.fullName} has been approved for the program.`,
      });
    }
  };
  
  const pendingStudentCount = students.filter(s => s.status === 'Pending').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Approval Recommendations</CardTitle>
        <CardDescription>
          Click the button to analyze all pending students. The AI will rank them based on GPA, skills, and experience to help you select the best candidates.
        </CardDescription>
      </CardHeader>
       <CardContent>
           {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center rounded-lg border h-96 bg-card text-center text-muted-foreground p-8">
                     <Loader2 className="h-12 w-12 animate-spin text-primary" />
                     <p className="mt-4 font-semibold">Analyzing student profiles...</p>
                     <p className="text-sm">This may take a moment.</p>
                </div>
            ) : rankedStudents ? (
                <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                        {rankedStudents.map(rs => (
                            <Card key={rs.studentId} className="flex flex-col sm:flex-row items-start p-4 gap-4 transition-colors">
                                <Avatar className="h-16 w-16 border">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${rs.student.id}`} data-ai-hint="person" />
                                    <AvatarFallback>{rs.student.firstName.charAt(0)}{rs.student.lastName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-lg">{rs.student.fullName}</p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>GPA: {rs.student.currentGpa}</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {rs.student.skills.slice(0,3).map(skill => <Badge variant="secondary" key={skill}>{skill}</Badge>)}
                                                </div>
                                            </div>
                                        </div>
                                         <div className="text-right">
                                            <p className="text-xl font-bold text-primary">{Math.round(rs.holisticScore)}%</p>
                                            <p className="text-xs text-muted-foreground">Holistic Score</p>
                                        </div>
                                    </div>
                                    <Progress value={rs.holisticScore} className="h-2" />
                                    <p className="text-sm text-muted-foreground pt-1 italic">
                                        <span className="font-semibold">AI Justification:</span> "{rs.justification}"
                                    </p>
                                </div>
                                <Button size="sm" onClick={() => handleApproveStudent(rs.student.id)} className="w-full sm:w-auto mt-2 sm:mt-0">
                                    <CheckCircle className="mr-2" />
                                    Approve
                                </Button>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-96 bg-card text-center text-muted-foreground p-8">
                    <User className="h-12 w-12" />
                    <p className="mt-4 font-semibold">Ready to find the best talent?</p>
                    <p className="text-sm max-w-sm mx-auto">There are currently {pendingStudentCount} students awaiting approval. Use our AI to analyze their profiles and rank them for the capstone program.</p>
                </div>
            )}
       </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyze} disabled={isAnalyzing || pendingStudentCount === 0} className="w-full">
          {isAnalyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Recommendations ({pendingStudentCount} pending)
        </Button>
      </CardFooter>
    </Card>
  );
}
