import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, PlusCircle } from "lucide-react";

const projectData = [
    { id: '1', title: 'AI Data Platform', student: 'Aisha Khan', status: 'Ongoing' },
    { id: '2', title: 'E-commerce App', student: 'Carla Rodriguez', status: 'Ongoing' },
    { id: '3', title: 'Cloud Backend', student: 'David Lee', status: 'Completed' },
    { id: '4', title: 'Data Visualization', student: 'Ben Carter', status: 'Completed' },
]

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Projects
        </h2>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
        </Button>
      </div>
      <div className="flex items-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline">
                Filter by <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>Ongoing</DropdownMenuItem>
            <DropdownMenuItem>Completed</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="pt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projectData.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>{project.student}</TableCell>
                            <TableCell>{project.status}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">View</Button>
                                {project.status === 'Completed' && (
                                     <Button variant="secondary" size="sm" className="ml-2">Analyze</Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
