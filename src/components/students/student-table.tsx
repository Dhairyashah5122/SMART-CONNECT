import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { students, projects, mentors } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export function StudentTable() {
  return (
    <Card>
       <CardHeader>
        <CardTitle>Approved Students</CardTitle>
        <CardDescription>A list of all students approved for the Smaty Capstone project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Matched Project</TableHead>
              <TableHead>Assigned Mentor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Skills</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const project = projects.find(p => p.id === student.projectId);
              const mentor = mentors.find(m => m.id === student.mentorId);
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${student.firstName.charAt(0)}`} />
                      <AvatarFallback>{student.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                  <TableCell>{project?.name || 'N/A'}</TableCell>
                  <TableCell>{mentor?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'Approved' ? 'default' : 'secondary'}
                     className={student.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
