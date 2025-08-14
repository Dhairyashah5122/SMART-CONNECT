import { StudentApprovalTable } from "@/components/admin/student-approval-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StudentApprovalsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Student Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve pending student applications for the SMART Capstone
          program.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>
            The following students have submitted their applications and are
            awaiting approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentApprovalTable />
        </CardContent>
      </Card>
    </div>
  );
}
