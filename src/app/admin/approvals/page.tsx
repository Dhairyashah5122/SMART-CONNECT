import { StudentApprovalRecommender } from "@/components/admin/student-approval-recommender";

export default function StudentApprovalsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Student Approvals</h1>
        <p className="text-muted-foreground">
          Use AI to rank and review pending student applications for the SMART Capstone program.
        </p>
      </div>
      <StudentApprovalRecommender />
    </div>
  );
}
