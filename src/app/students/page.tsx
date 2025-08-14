import { StudentTable } from "@/components/students/student-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Student Database
        </h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>
      <StudentTable />
    </div>
  );
}
