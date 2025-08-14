import { AddStudentForm } from "@/components/students/add-student-form";
import { StudentApprovalRecommender } from "@/components/admin/student-approval-recommender";
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
import { Separator } from "@/components/ui/separator";

export default function StudentApprovalsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Student Approvals</h1>
        <p className="text-muted-foreground">
          Register new applicants and use AI to rank and review them for the SMART Capstone program.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>1. Student Registration</CardTitle>
          <CardDescription>
            Register students individually or upload an Excel file for bulk registration. Newly registered students will appear in the approval list below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single"><User className="mr-2"/>Individual Registration</TabsTrigger>
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
      
      <Separator />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          2. Approval Recommendations
        </h2>
        <p className="text-muted-foreground">
          Use AI to rank and review pending student applications.
        </p>
      </div>
      <StudentApprovalRecommender />
    </div>
  );
}
