import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { projects, students } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export function ProjectList() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {projects.map((project) => (
        <AccordionItem value={project.id} key={project.id}>
          <AccordionTrigger className="text-xl font-semibold hover:no-underline">
            <div className="flex items-center gap-4">
              <span>{project.name}</span>
              <Badge>{project.company}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-4">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">{project.description}</p>
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Students</CardTitle>
                  <CardDescription>Students currently matched with this project.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students
                      .filter(s => s.projectId === project.id)
                      .map(student => (
                        <div key={student.id} className="flex items-center gap-4">
                           <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png?text=${student.firstName.charAt(0)}`} />
                            <AvatarFallback>{student.firstName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{student.firstName} {student.lastName}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {student.skills.slice(0,3).map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      {students.filter(s => s.projectId === project.id).length === 0 && (
                        <p className="text-sm text-muted-foreground">No students assigned to this project yet.</p>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
