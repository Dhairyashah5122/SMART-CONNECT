import { ReportGenerator } from "@/components/reports/report-generator";

export default function ShowcasePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Showcase Generation
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Use AI to generate compelling success stories and detailed case studies from project reports.
        </p>
      </div>
      <ReportGenerator />
    </div>
  );
}
