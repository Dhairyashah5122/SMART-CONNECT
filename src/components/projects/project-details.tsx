
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { projects, students } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export function ProjectDetails() {
  // In a real app, you'd fetch the project data based on an ID.
  // For now, we'll use the first project from our mock data.
  const project = projects[0];
  const assignedStudents = students.filter(s => project.studentIds.includes(s.id));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.company}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Assigned Team</CardTitle>
                    <CardDescription>Students currently matched with this project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {assignedStudents.length > 0 ? assignedStudents.map(student => (
                        <div key={student.id} className="flex items-center gap-4">
                           <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${student.id}`} data-ai-hint="person" />
                            <AvatarFallback>{student.firstName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{student.fullName}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {student.skills.slice(0,4).map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground">No students assigned to this project yet.</p>
                      )}
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Project Status</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
