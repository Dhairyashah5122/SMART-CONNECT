import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { projects } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">
            Projects
            </h2>
            <p className="text-muted-foreground">Manage all company projects.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
        </Button>
      </div>
      <div className="flex items-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline">
                Filter by Status <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>Ongoing</DropdownMenuItem>
            <DropdownMenuItem>Completed</DropdownMenuItem>
            <DropdownMenuItem>Not Assigned</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="pt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned Students</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{project.company}</TableCell>
                            <TableCell>
                                <Badge 
                                    variant={
                                        project.status === 'Ongoing' ? 'default' : 
                                        project.status === 'Completed' ? 'secondary' : 'outline'
                                    }
                                     className={
                                        project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                                        project.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : ''
                                     }
                                >
                                    {project.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{project.studentIds.length}</TableCell>
                            <TableCell className="text-right">
                                <Link href={`/projects/view-details`}>
                                    <Button variant="outline" size="sm">View Details</Button>
                                </Link>
                                {project.status !== 'Completed' && (
                                    <Link href={`/projects/edit`}>
                                     <Button variant="secondary" size="sm" className="ml-2">Edit</Button>
                                    </Link>
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