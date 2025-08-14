import { ComparativeAnalysisForm } from "@/components/analysis/comparative-analysis-form";
import { SurveyDataAnalysisForm } from "@/components/analysis/survey-data-analysis-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AnalysisPage() {
    return (
    <div className="flex flex-col gap-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">
                AI-Powered Analysis
            </h2>
            <p className="text-muted-foreground">
                Employ AI for comparative analysis between project scope, student outcomes, and Safirnaction objectives.
            </p>
        </div>

        <Tabs defaultValue="comparative-analysis">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comparative-analysis">Document-Based Comparative Analysis</TabsTrigger>
                <TabsTrigger value="survey-data">Survey Text Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="comparative-analysis">
               <ComparativeAnalysisForm />
            </TabsContent>
            <TabsContent value="survey-data">
                <SurveyDataAnalysisForm />
            </TabsContent>
        </Tabs>

       
    </div>
    );
}
