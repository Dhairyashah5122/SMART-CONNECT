import { ProjectDetails } from "@/components/projects/project-details";

export default function ViewProjectDetailsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Project Details
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          View the complete details of the project and the assigned team.
        </p>
      </div>
      <ProjectDetails />
    </div>
  );
}