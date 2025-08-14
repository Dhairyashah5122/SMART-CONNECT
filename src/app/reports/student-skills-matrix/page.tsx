
import { StudentSkillsMatrixForm } from "@/components/reports/student-skills-matrix-form";

export default function StudentSkillsMatrixPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Student Skills Matrix
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Select a date range to generate a report on the skills distribution of students registered during that period.
        </p>
      </div>
      <StudentSkillsMatrixForm />
    </div>
  );
}
