import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";

const reportTypes = [
  {
    title: 'Student Skills Matrix',
    description: 'A comprehensive report detailing the skills distribution across all registered students.',
  },
  {
    title: 'Project Matching Success Rate',
    description: 'Analyzes the effectiveness of student-project matches over a selected period.',
  },
  {
    title: 'Survey Response Summary',
    description: 'Aggregates data from a specific survey to highlight key trends and insights.',
  },
  {
    title: 'Alignment Gap Analysis Report',
    description: 'Generates a formal document based on the results of the comparative analysis.',
  },
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Generate Reports
        </h2>
      </div>
      <p className="text-muted-foreground max-w-3xl">
        Create and download detailed reports to support decision-making, track progress, and share insights with stakeholders. Select a report type below to get started.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-grow">
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
