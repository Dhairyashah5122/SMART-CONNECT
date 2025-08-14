import { ComparativeAnalysisForm } from "@/components/analysis/comparative-analysis-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AnalysisPage() {
    return (
    <div className="flex flex-col gap-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">
                Comparative Analysis
            </h2>
            <p className="text-muted-foreground">
                Employ AI for comparative analysis between project scope, student outcomes, and Safirnaction objectives.
            </p>
        </div>

        <Tabs defaultValue="ai-analysis">
            <TabsList>
                <TabsTrigger value="ai-analysis">AI-Powered Analysis</TabsTrigger>
                <TabsTrigger value="survey-data">Survey Data Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="ai-analysis">
               <ComparativeAnalysisForm />
            </TabsContent>
            <TabsContent value="survey-data">
                <Card>
                    <CardHeader>
                        <CardTitle>Survey Data Analysis</CardTitle>
                        <CardDescription>
                            Deep dive into survey results to uncover trends and insights. This feature is under development.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Survey analysis charts will be displayed here.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

       
    </div>
    );
}
