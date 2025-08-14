import { StudentProjectActions } from "@/components/students/student-project-actions";

export default function StudentProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          My Capstone Project
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Manage your project tasks, submit required documents, and track your progress from start to finish.
        </p>
      </div>
      <StudentProjectActions />
    </div>
  );
}
