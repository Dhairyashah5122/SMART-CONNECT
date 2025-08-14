import { StudentTable } from "@/components/students/student-table";
import { AddStudentForm } from "@/components/students/add-student-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BulkStudentUpload } from "@/components/students/bulk-student-upload";
import { User, Users } from "lucide-react";

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>
            Register students individually or upload an Excel file for bulk registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single"><User className="mr-2"/>Individual</TabsTrigger>
              <TabsTrigger value="bulk"><Users className="mr-2"/>Bulk Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="single">
                <CardHeader className="px-1">
                    <CardTitle>Add New Student</CardTitle>
                    <CardDescription>
                        Fill in the details to add a new student. Upload a resume to
                        automatically extract their skills.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-1">
                    <AddStudentForm />
                </CardContent>
            </TabsContent>
            <TabsContent value="bulk">
                 <CardHeader className="px-1">
                    <CardTitle>Bulk Student Upload</CardTitle>
                    <CardDescription>
                       Upload an Excel file (.xlsx) with student information. The file should contain columns for First Name, Last Name, and Email.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-1">
                    <BulkStudentUpload />
                </CardContent>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <StudentTable />
    </div>
  );
}
