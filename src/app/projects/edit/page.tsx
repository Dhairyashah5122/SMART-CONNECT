import { EditProjectForm } from "@/components/projects/edit-project-form";

export default function EditProjectPage() {
    return (
        <div className="flex flex-col gap-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">
            Edit Project
            </h2>
            <p className="text-muted-foreground max-w-3xl">
            Update the details for an existing project.
            </p>
        </div>
        <EditProjectForm />
        </div>
    );
}