
import { RoleManager } from "@/components/admin/role-manager";

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          User Role Management
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Assign and manage user roles across the platform. Changes are saved automatically.
        </p>
      </div>
      <RoleManager />
    </div>
  );
}
