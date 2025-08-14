import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, PlusCircle } from "lucide-react";


const analysisData = [
  { id: '1', title: 'Project Alpha', student: 'Aisha K.', status: 'Ongoing' },
  { id: '2', title: 'Project Beta', student: 'Ben C.', status: 'Ongoing' },
  { id: '3', title: 'Project Gamma', student: 'Carla R.', status: 'Completed' },
  { id: '4', title: 'Project Delta', student: 'David L.', status: 'Ongoing' },
];

export default function AnalysisPage() {
    return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
                AI Analysis
            </h2>
             <Button>
                <PlusCircle className="mr-2" />
                New Project
            </Button>
        </div>

        <div className="flex items-center gap-4">
            <Select>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Project Name" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="p1">Project Alpha</SelectItem>
                    <SelectItem value="p2">Project Beta</SelectItem>
                    <SelectItem value="p3">Project Gamma</SelectItem>
                </SelectContent>
            </Select>

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Title by <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem>Ascending</DropdownMenuItem>
                <DropdownMenuItem>Descending</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <Card>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analysisData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.student}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm">View</Button>
                                <Button variant="secondary" size="sm">Analyze</Button>
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
