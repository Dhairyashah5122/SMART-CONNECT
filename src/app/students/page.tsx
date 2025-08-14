import { StudentTable } from "@/components/students/student-table";
import { AddStudentForm } from "@/components/students/add-student-form";

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-8">
       <AddStudentForm />
      <StudentTable />
    </div>
  );
}
