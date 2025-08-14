import { ComparativeAnalysisForm } from "@/components/analysis/comparative-analysis-form";

export default function AnalysisPage() {
    return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
            AI-Powered Comparative Analysis
            </h2>
        </div>
        <p className="text-muted-foreground max-w-3xl">
            Use our AI tool to perform a comparative analysis between project scope, student outcomes, and Safirnaction objectives. This helps identify critical gaps and strategic alignments to enhance project success and impact.
        </p>
        <ComparativeAnalysisForm />
    </div>
    );
}
