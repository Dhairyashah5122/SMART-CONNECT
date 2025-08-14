
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { students as initialStudents } from "@/lib/data";
import type { Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

export function StudentApprovalTable() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const { toast } = useToast();

  const handleApproveStudent = (studentId: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, status: "Approved" } : student
      )
    );

    const student = students.find((s) => s.id === studentId);
    if (student) {
      toast({
        title: "Student Approved",
        description: `${student.fullName} has been approved for the program.`,
      });
    }
  };

  const pendingStudents = students.filter(
    (student) => student.status === "Pending"
  );

  return (
    <div>
      {pendingStudents.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>NDA Status</TableHead>
              <TableHead>Consent Letter</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.fullName}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.emailAddress}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      student.ndaStatus === "Signed" ? "default" : "secondary"
                    }
                    className={
                      student.ndaStatus === "Signed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                    }
                  >
                    {student.ndaStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={student.consentLetter ? "default" : "destructive"}
                    className={
                      student.consentLetter
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : ""
                    }
                  >
                    {student.consentLetter ? "Submitted" : "Missing"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => handleApproveStudent(student.id)}
                    disabled={!student.consentLetter || student.ndaStatus !== 'Signed'}
                  >
                    <CheckCircle className="mr-2" />
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No pending student applications.
        </div>
      )}
    </div>
  );
}
