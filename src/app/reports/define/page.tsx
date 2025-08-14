import { DefineReportForm } from "@/components/reports/define-report-form";

export default function DefineReportPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Define New Report Type
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Create a new report type by providing its details below. It will then appear on the main reports page for generation.
        </p>
      </div>
      <DefineReportForm />
    </div>
  );
}
