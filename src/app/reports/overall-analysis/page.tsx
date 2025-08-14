import { OverallProjectReportForm } from "@/components/reports/overall-project-report-form";

export default function OverallAnalysisPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Overall Project Analysis
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Select a date range to generate a comprehensive analysis of projects, highlighting trends, successes, and challenges.
        </p>
      </div>
      <OverallProjectReportForm />
    </div>
  );
}
