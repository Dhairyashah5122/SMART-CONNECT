import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { surveys } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"

export function SurveyList() {
  return (
    <Card>
       <CardHeader>
        <CardTitle>All Surveys</CardTitle>
        <CardDescription>A list of all surveys in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Responses</TableHead>
              <TableHead className="w-[150px]">Created At</TableHead>
              <TableHead className="w-[120px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
                <TableCell>
                  <Badge variant={survey.status === 'Active' ? 'default' : 'secondary'}
                   className={survey.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                  >
                    {survey.status}
                  </Badge>
                </TableCell>
                <TableCell>{survey.responses}</TableCell>
                <TableCell>{new Date(survey.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
