import { ComparativeAnalysisForm } from "@/components/analysis/comparative-analysis-form";
import { SurveyDataAnalysisForm } from "@/components/analysis/survey-data-analysis-form";
import { Separator } from "@/components/ui/separator";

export default function AnalysisPage() {
    return (
    <div className="flex flex-col gap-8">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">
                AI-Powered Analysis
            </h2>
            <p className="text-muted-foreground">
                Employ AI for comparative analysis between project scope, student outcomes, and Safirnaction objectives.
            </p>
        </div>

        <div className="space-y-8">
            <ComparativeAnalysisForm />
            <Separator />
            <SurveyDataAnalysisForm />
        </div>
    </div>
    );
}
