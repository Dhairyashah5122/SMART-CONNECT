import { TalentMatcher } from "@/components/projects/talent-matcher";

export default function TalentMatchingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Student-Project Matching
        </h2>
      </div>
       <p className="text-muted-foreground max-w-3xl">
        Use our AI-powered tool to find the perfect student for your project. Select a student and a project to see a compatibility score and a detailed justification.
      </p>
      <TalentMatcher />
    </div>
  );
}
