import { ProjectList } from "@/components/projects/project-list";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          All Projects
        </h2>
      </div>
       <p className="text-muted-foreground max-w-3xl">
        Browse all the capstone projects available. You can view details for each project, including the company, description, and assigned students.
      </p>
      <ProjectList />
    </div>
  );
}
