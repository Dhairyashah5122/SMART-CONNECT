import { SurveyList } from "@/components/surveys/survey-list";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";

export default function SurveysPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Survey Management
        </h2>
        <Button asChild variant="outline">
          <Link href="/surveys/create">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create Survey
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground max-w-3xl">
        Oversee all surveys from a single dashboard. Track their status, view response rates, and access detailed results to gather valuable insights from students and stakeholders.
      </p>
      <SurveyList />
    </div>
  );
}
