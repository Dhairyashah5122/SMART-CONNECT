import { CreateSurveyForm } from "@/components/surveys/create-survey-form";

export default function CreateSurveyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Survey
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Build a new survey to gather insights from students, mentors, or companies.
        </p>
      </div>
      <CreateSurveyForm />
    </div>
  );
}
