import { TalentMatcher } from "@/components/projects/talent-matcher";

export default function TalentMatchingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          AI-Powered Team Builder
        </h2>
      </div>
       <p className="text-muted-foreground max-w-3xl">
        Select a project to get an AI-ranked list of all available students. Build your team by adding students, then finalize the assignment.
      </p>
      <TalentMatcher />
    </div>
  );
}
