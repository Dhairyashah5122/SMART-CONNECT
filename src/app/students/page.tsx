import { StudentTable } from "@/components/students/student-table";
import { AddStudentForm } from "@/components/students/add-student-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
          <CardDescription>
            Fill in the details to add a new student. Upload a resume to
            automatically extract their skills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddStudentForm />
        </CardContent>
      </Card>
      <StudentTable />
    </div>
  );
}
