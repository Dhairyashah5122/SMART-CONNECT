import { TalentMatcher } from "@/components/projects/talent-matcher";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Student-Project Matching
        </h2>
      </div>
      <TalentMatcher />
    </div>
  );
}
