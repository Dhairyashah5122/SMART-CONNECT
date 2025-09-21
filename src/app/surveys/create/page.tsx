import { CreateSurveyForm } from "@/components/surveys/create-survey-form";
import { LinkExternalSurveyForm } from "@/components/surveys/link-external-survey-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, PenSquare } from "lucide-react";

export default function CreateSurveyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Survey
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Build a custom survey with our editor, or link to an external survey from platforms like Google Forms or SurveyMonkey.
        </p>
      </div>
      <Tabs defaultValue="create">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create"><PenSquare className="mr-2"/>Create Custom Survey</TabsTrigger>
            <TabsTrigger value="link"><Link className="mr-2"/>Link External Survey</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
            <CreateSurveyForm />
        </TabsContent>
        <TabsContent value="link">
            <Card>
                <CardHeader>
                    <CardTitle>Link to External Survey</CardTitle>
                    <CardDescription>
                        If you are using an external platform like Google Forms, paste the link here to track it within SMART CONNECTION.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LinkExternalSurveyForm />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
